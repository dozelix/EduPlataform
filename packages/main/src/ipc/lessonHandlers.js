import { ipcMain } from 'electron'
import mongoose from 'mongoose'

// ======================================================
// IPC Lesson Handlers (Caso 3 — Vista 4: Lección)
// Reproductor de lección + comentarios. Lectura directa de las colecciones
// del seed (lecciones, comentarios, cursos, inscripciones).
// Null-safe ante datos faltantes (el seed no trae contenido/duración) y
// autores huérfanos en comentarios.
// Canales: leccion:*, comentario:*
// ======================================================

function toObjectId(id) {
  return new mongoose.Types.ObjectId(id)
}

// Obtener una lección con datos de navegación (siguiente) y estado de completada.
ipcMain.handle('leccion:obtener', async (_, { leccionId, usuarioId } = {}) => {
  try {
    if (!leccionId) return { success: false, error: 'leccionId requerido' }
    let lid
    try {
      lid = toObjectId(leccionId)
    } catch {
      return { success: false, error: 'leccionId inválido' }
    }

    const db = mongoose.connection.db
    const leccion = await db.collection('lecciones').findOne({ _id: lid })
    if (!leccion) return { success: false, error: 'La lección no existe' }

    const curso = await db.collection('cursos').findOne({ _id: leccion.curso_id })

    // Hermanas del mismo curso, ordenadas por número, para resolver "siguiente".
    const hermanas = await db
      .collection('lecciones')
      .find({ curso_id: leccion.curso_id })
      .sort({ numero: 1 })
      .toArray()
    const idx = hermanas.findIndex((l) => l._id.toString() === lid.toString())
    const siguiente = idx >= 0 && idx < hermanas.length - 1 ? hermanas[idx + 1] : null

    let completada = false
    if (usuarioId) {
      try {
        const uid = toObjectId(usuarioId)
        const insc = await db
          .collection('inscripciones')
          .findOne({ usuario_id: uid, curso_id: leccion.curso_id })
        completada = !!(
          insc &&
          (insc.lecciones_completadas || []).some((x) => x.toString() === lid.toString())
        )
      } catch {
        // usuarioId inválido: se ignora, completada queda en false.
      }
    }

    return {
      success: true,
      data: {
        id: leccion._id.toString(),
        numero: leccion.numero ?? null,
        titulo: leccion.titulo,
        videoUrl: leccion.video_url || null,
        // El seed no trae estos campos; van con fallback (límite del dato del caso).
        contenido: leccion.contenido_text || leccion.contenido || null,
        duracion: typeof leccion.duracion_minutos === 'number' ? leccion.duracion_minutos : null,
        cursoId: leccion.curso_id ? leccion.curso_id.toString() : null,
        cursoNombre: curso ? curso.nombre : 'Curso no disponible',
        siguienteId: siguiente ? siguiente._id.toString() : null,
        completada,
      },
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Marcar una lección como completada para el usuario y recalcular el progreso
// del curso = lecciones completadas / total de lecciones.
ipcMain.handle('leccion:completar', async (_, { usuarioId, leccionId } = {}) => {
  try {
    if (!usuarioId || !leccionId) {
      return { success: false, error: 'usuarioId y leccionId requeridos' }
    }
    let uid, lid
    try {
      uid = toObjectId(usuarioId)
      lid = toObjectId(leccionId)
    } catch {
      return { success: false, error: 'Identificador inválido' }
    }

    const db = mongoose.connection.db
    const leccion = await db.collection('lecciones').findOne({ _id: lid })
    if (!leccion) return { success: false, error: 'La lección no existe' }

    const insc = await db
      .collection('inscripciones')
      .findOne({ usuario_id: uid, curso_id: leccion.curso_id })
    if (!insc) return { success: false, error: 'No estás inscrito en este curso' }

    await db
      .collection('inscripciones')
      .updateOne({ _id: insc._id }, { $addToSet: { lecciones_completadas: lid } })

    const total = await db.collection('lecciones').countDocuments({ curso_id: leccion.curso_id })
    const actualizada = await db.collection('inscripciones').findOne({ _id: insc._id })
    const completadas = (actualizada.lecciones_completadas || []).length
    const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0

    await db.collection('inscripciones').updateOne({ _id: insc._id }, { $set: { progreso } })

    return { success: true, data: { progreso, completada: true } }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Últimos 5 comentarios de una lección, con el nombre del autor (null-safe).
ipcMain.handle('comentario:listar', async (_, leccionId) => {
  try {
    if (!leccionId) return { success: false, error: 'leccionId requerido' }
    let lid
    try {
      lid = toObjectId(leccionId)
    } catch {
      return { success: false, error: 'leccionId inválido' }
    }

    const db = mongoose.connection.db
    const docs = await db
      .collection('comentarios')
      .find({ leccion_id: lid })
      .sort({ _id: -1 })
      .limit(5)
      .toArray()

    const usuarios = await db.collection('usuarios').find().toArray()
    const nombrePorId = new Map(usuarios.map((u) => [u._id.toString(), u.nombre]))

    const data = docs.map((c) => ({
      id: c._id.toString(),
      texto: c.texto,
      autor: nombrePorId.get(c.usuario_id?.toString()) || 'Usuario desconocido',
      fecha: c.fecha ? new Date(c.fecha).toISOString() : null,
    }))

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Crear un comentario en una lección.
ipcMain.handle('comentario:crear', async (_, { leccionId, usuarioId, texto } = {}) => {
  try {
    if (!leccionId || !usuarioId || !texto || !texto.trim()) {
      return { success: false, error: 'Faltan datos del comentario' }
    }
    let lid, uid
    try {
      lid = toObjectId(leccionId)
      uid = toObjectId(usuarioId)
    } catch {
      return { success: false, error: 'Identificador inválido' }
    }

    const db = mongoose.connection.db
    if (!(await db.collection('lecciones').findOne({ _id: lid }))) {
      return { success: false, error: 'La lección no existe' }
    }

    const r = await db.collection('comentarios').insertOne({
      leccion_id: lid,
      usuario_id: uid,
      texto: texto.trim(),
      fecha: new Date(),
    })
    return { success: true, data: { id: r.insertedId.toString() } }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
