import { ipcMain } from 'electron'
import mongoose from 'mongoose'

// ======================================================
// IPC Course Handlers
// Lee las colecciones del seed del Caso 3 (cursos, usuarios).
// Se usa el driver nativo de mongoose (connection.db) en vez de modelos:
// los datos ya existen con su forma propia (campos en español, _id fijos) y
// leer directo evita que un esquema estricto descarte campos.
// Canales: curso:*
// ======================================================

// Listar cursos con el nombre del instructor resuelto (join null-safe).
// Un curso puede apuntar a un instructor inexistente (dato huérfano del seed);
// en ese caso se muestra "Instructor desconocido" en vez de romper.
// Si se pasa usuarioId, marca `inscrito` por curso (para el botón "Inscribirse").
ipcMain.handle('curso:listar', async (_, usuarioId) => {
  try {
    const db = mongoose.connection.db
    const cursos = await db.collection('cursos').find().toArray()
    const instructores = await db.collection('usuarios').find({ tipo: 'instructor' }).toArray()

    const nombrePorId = new Map(instructores.map((u) => [u._id.toString(), u.nombre]))

    let inscritos = new Set()
    if (usuarioId) {
      try {
        const uid = new mongoose.Types.ObjectId(usuarioId)
        const ins = await db.collection('inscripciones').find({ usuario_id: uid }).toArray()
        inscritos = new Set(ins.map((i) => i.curso_id?.toString()))
      } catch {
        // usuarioId inválido: se ignora y todos quedan como no inscritos.
      }
    }

    const data = cursos.map((c) => ({
      id: c._id.toString(),
      nombre: c.nombre,
      precio: typeof c.precio === 'number' ? c.precio : null,
      instructor: nombrePorId.get(c.instructor_id?.toString()) || 'Instructor desconocido',
      // El seed no trae calificación por curso; queda como no disponible.
      calificacion: c.calificacion ?? null,
      inscrito: inscritos.has(c._id.toString()),
    }))

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error.message }
  }
})
