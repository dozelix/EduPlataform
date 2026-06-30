import { ipcMain } from 'electron'
import mongoose from 'mongoose'

// ======================================================
// IPC Learning Handlers (Caso 3 — Vista 3: Mi Aprendizaje)
// Cruza inscripciones + cursos + lecciones del usuario en sesión.
// Null-safe: una inscripción puede apuntar a un curso inexistente
// (dato huérfano del seed); en ese caso la fila se marca como no disponible.
// Canales: aprendizaje:*
// ======================================================

ipcMain.handle('aprendizaje:listar', async (_, usuarioId) => {
  try {
    if (!usuarioId) {
      return { success: false, error: 'usuarioId requerido' }
    }
    let uid
    try {
      uid = new mongoose.Types.ObjectId(usuarioId)
    } catch {
      return { success: false, error: 'usuarioId inválido' }
    }

    const db = mongoose.connection.db
    const inscripciones = await db.collection('inscripciones').find({ usuario_id: uid }).toArray()
    const cursos = await db.collection('cursos').find().toArray()
    const instructores = await db.collection('usuarios').find({ tipo: 'instructor' }).toArray()
    const lecciones = await db.collection('lecciones').find().toArray()

    const cursoPorId = new Map(cursos.map((c) => [c._id.toString(), c]))
    const instructorPorId = new Map(instructores.map((u) => [u._id.toString(), u.nombre]))

    const data = inscripciones.map((ins) => {
      const progreso = typeof ins.progreso === 'number' ? ins.progreso : 0
      const curso = cursoPorId.get(ins.curso_id?.toString())

      if (!curso) {
        return {
          inscripcionId: ins._id.toString(),
          cursoId: ins.curso_id ? ins.curso_id.toString() : null,
          curso: 'Curso no disponible',
          instructor: '—',
          progreso,
          ultimaLeccion: '—',
          primeraLeccionId: null,
          disponible: false,
        }
      }

      // Lecciones del curso ordenadas por número.
      const lecsCurso = lecciones
        .filter((l) => l.curso_id?.toString() === curso._id.toString())
        .sort((a, b) => (a.numero || 0) - (b.numero || 0))
      const ultimaLeccion = lecsCurso.length ? lecsCurso[lecsCurso.length - 1].titulo : '—'
      const primeraLeccionId = lecsCurso.length ? lecsCurso[0]._id.toString() : null

      return {
        inscripcionId: ins._id.toString(),
        cursoId: curso._id.toString(),
        curso: curso.nombre,
        instructor: instructorPorId.get(curso.instructor_id?.toString()) || 'Instructor desconocido',
        progreso,
        ultimaLeccion,
        primeraLeccionId,
        disponible: true,
      }
    })

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

// Inscribir al usuario en un curso. Valida que el curso exista (no se permite
// inscribir a un curso inexistente) y evita inscripciones duplicadas.
ipcMain.handle('inscripcion:crear', async (_, { usuarioId, cursoId } = {}) => {
  try {
    if (!usuarioId || !cursoId) {
      return { success: false, error: 'usuarioId y cursoId requeridos' }
    }
    let uid, cid
    try {
      uid = new mongoose.Types.ObjectId(usuarioId)
      cid = new mongoose.Types.ObjectId(cursoId)
    } catch {
      return { success: false, error: 'Identificador inválido' }
    }

    const db = mongoose.connection.db
    const curso = await db.collection('cursos').findOne({ _id: cid })
    if (!curso) {
      return { success: false, error: 'El curso no existe' }
    }

    const yaInscrito = await db.collection('inscripciones').findOne({ usuario_id: uid, curso_id: cid })
    if (yaInscrito) {
      return { success: false, error: 'Ya estás inscrito en este curso' }
    }

    const r = await db.collection('inscripciones').insertOne({
      usuario_id: uid,
      curso_id: cid,
      progreso: 0,
    })
    return { success: true, data: { id: r.insertedId.toString() } }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
