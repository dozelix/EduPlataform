// Verificacion del pseudo-backend (issue #22). Reproduce la logica exacta de los handlers
// IPC (curso:listar, aprendizaje:listar, leccion:obtener, comentario:listar) contra la BD
// real con el seed de volumen, para el usuario de testeo. No usa Electron: ejercita las
// mismas consultas que corren los handlers y verifica que las 4 vistas reciben datos correctos.
//
// Requisitos: MongoDB corriendo y seeds/eduplatform.volume.seed.js cargado.
// Uso (desde la raiz del repo):  node scripts/verify-backend.cjs

const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduplatform';
let pass = 0;
let fail = 0;

// Imprime el resultado de una asercion y lleva la cuenta.
function check(nombre, cond, extra) {
  if (cond) {
    pass++;
    console.log('  OK   ' + nombre + (extra ? '  -> ' + extra : ''));
  } else {
    fail++;
    console.log('  FAIL ' + nombre + (extra ? '  -> ' + extra : ''));
  }
}

async function main() {
  await mongoose.connect(URI);
  const db = mongoose.connection.db;
  const OID = mongoose.Types.ObjectId;

  const alumno = await db.collection('usuarios').findOne({ email: 'alumno.test@edu.cl' });
  check('alumno de testeo existe', !!alumno);
  if (!alumno) {
    console.log('\nNo hay datos de testeo. Carga seeds/eduplatform.volume.seed.js primero.');
    await mongoose.disconnect();
    process.exit(1);
  }

  // curso:listar (Catalogo) — join null-safe instructor + flag inscrito.
  const cursos = await db.collection('cursos').find().toArray();
  const instructores = await db.collection('usuarios').find({ tipo: 'instructor' }).toArray();
  const nombrePorId = new Map(instructores.map((u) => [u._id.toString(), u.nombre]));
  const ins = await db.collection('inscripciones').find({ usuario_id: alumno._id }).toArray();
  const inscritos = new Set(ins.map((i) => i.curso_id && i.curso_id.toString()));
  const catalogo = cursos.map((c) => ({
    nombre: c.nombre,
    instructor: nombrePorId.get(c.instructor_id && c.instructor_id.toString()) || 'Instructor desconocido',
    calificacion: c.calificacion != null ? c.calificacion : null,
    inscrito: inscritos.has(c._id.toString()),
  }));
  check('curso:listar devuelve 100 cursos', catalogo.length === 100, catalogo.length + ' cursos');
  check('todos los cursos resuelven instructor (0 huerfanos)', catalogo.every((c) => c.instructor !== 'Instructor desconocido'));
  check('cursos traen calificacion (no null)', catalogo.every((c) => c.calificacion != null));
  check('el alumno aparece inscrito en >=1 curso', catalogo.some((c) => c.inscrito));

  // Busqueda y filtro (logica del frontend Catalog.jsx).
  const q = catalogo[0].nombre.slice(0, 4).toLowerCase();
  check('busqueda por nombre devuelve resultados', catalogo.filter((c) => c.nombre.toLowerCase().includes(q)).length >= 1);
  check('filtro por instructor devuelve resultados', catalogo.filter((c) => c.instructor === catalogo[0].instructor).length >= 1);

  // aprendizaje:listar (Mi Aprendizaje) — logica con progreso real (lecciones_completadas):
  // "Continuar" apunta a la primera leccion pendiente (no a la 1 fija) y "Ultima leccion"
  // es la ultima efectivamente completada. Espeja el handler learningHandlers.js.
  const lecciones = await db.collection('lecciones').find().toArray();
  const cursoPorId = new Map(cursos.map((c) => [c._id.toString(), c]));
  const aprendizaje = ins.map((i) => {
    const curso = cursoPorId.get(i.curso_id && i.curso_id.toString());
    const lecs = lecciones
      .filter((l) => l.curso_id && curso && l.curso_id.toString() === curso._id.toString())
      .sort((a, b) => (a.numero || 0) - (b.numero || 0));
    const completadas = new Set((i.lecciones_completadas || []).map((x) => x.toString()));
    const completadasEnOrden = lecs.filter((l) => completadas.has(l._id.toString()));
    const pendiente = lecs.find((l) => !completadas.has(l._id.toString()));
    const continuar = pendiente || lecs[lecs.length - 1] || null;
    const ultima = completadasEnOrden[completadasEnOrden.length - 1] || null;
    const primeraId = lecs.length ? lecs[0]._id.toString() : null;
    return {
      disponible: !!curso,
      totalLecs: lecs.length,
      nCompletadas: completadasEnOrden.length,
      continuarLeccionId: continuar ? continuar._id.toString() : null,
      ultimaLeccion: ultima ? ultima.titulo : 'Sin empezar',
      primeraCompletada: primeraId ? completadas.has(primeraId) : false,
      continuarEsPrimera: continuar && primeraId ? continuar._id.toString() === primeraId : false,
    };
  });
  check('aprendizaje:listar devuelve las inscripciones del alumno', aprendizaje.length === ins.length, aprendizaje.length + ' filas');
  check('cada fila tiene curso disponible', aprendizaje.every((f) => f.disponible));
  check('hay una leccion para "Continuar"', aprendizaje.some((f) => f.continuarLeccionId));

  // Progreso real: en cursos donde la leccion 1 ya esta completada (y no todo el curso),
  // "Continuar" NO debe volver a la leccion 1 y "Ultima leccion" no debe ser "Sin empezar".
  const conProgreso = aprendizaje.filter((f) => f.primeraCompletada && f.nCompletadas < f.totalLecs);
  check('hay cursos con la leccion 1 ya completada para probar el progreso', conProgreso.length > 0, conProgreso.length + ' cursos');
  check('"Continuar" respeta el progreso (no vuelve a la leccion 1)', conProgreso.every((f) => !f.continuarEsPrimera));
  check('cursos ya empezados muestran ultima leccion (no "Sin empezar")', conProgreso.every((f) => f.ultimaLeccion !== 'Sin empezar'));

  // leccion:obtener + comentario:listar (Leccion).
  const conLeccion = aprendizaje.find((f) => f.continuarLeccionId);
  const lid = new OID(conLeccion.continuarLeccionId);
  const leccion = await db.collection('lecciones').findOne({ _id: lid });
  check('leccion:obtener devuelve la leccion', !!leccion, leccion && leccion.titulo);
  const hermanas = await db.collection('lecciones').find({ curso_id: leccion.curso_id }).sort({ numero: 1 }).toArray();
  const idx = hermanas.findIndex((l) => l._id.toString() === lid.toString());
  check('navegacion: siguiente leccion resuelve', idx >= 0);
  const comentarios = await db.collection('comentarios').find({ leccion_id: lid }).sort({ _id: -1 }).limit(5).toArray();
  check('comentario:listar devuelve <=5 comentarios', comentarios.length <= 5, comentarios.length + ' comentarios');

  console.log('\nRESULTADO: ' + pass + ' OK, ' + fail + ' FAIL');
  await mongoose.disconnect();
  process.exit(fail ? 1 : 0);
}

main().catch((e) => {
  console.error('ERROR:', e.message);
  process.exit(2);
});
