/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/
const database = 'eduplataform';

// Create a new database.
use(database);

// Password de desarrollo "edu12345" (bcrypt) compartida, para iniciar sesion con cualquier usuario.
const PASS = '$2a$10$u5bCbkxGWzJlxymEoyt7BeX/TDTQON7pcQkK7.a52hJ58N/y8cmo6';

// Limpieza para un sembrado reproducible.
['usuarios', 'cursos', 'lecciones', 'inscripciones', 'comentarios', 'calificaciones'].forEach(
  (c) => db.getCollection(c).deleteMany({})
);

const pick = (a) => a[Math.floor(Math.random() * a.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const NOMBRES = ['Carlos','Ana','Luis','Maria','Jose','Sofia','Diego','Valentina','Mateo','Camila','Javier','Daniela','Andres','Fernanda','Pablo','Catalina','Ignacio','Antonia','Felipe','Isidora'];
const APELLIDOS = ['Ramirez','Soto','Lopez','Garcia','Martinez','Rojas','Munoz','Vargas','Castro','Morales','Silva','Reyes','Fuentes','Torres','Araya','Espinoza','Nunez','Gonzalez','Perez','Diaz'];
const TEMAS = ['Python','JavaScript','React','Node','MongoDB','Django','SQL','Docker','Linux','UX','Data Science','Machine Learning','CSS','HTML','TypeScript','Vue','Angular','Go','Rust','Java'];
const NIVELES = ['desde cero','intermedio','avanzado','practico','profesional'];
const ESPECIALIDADES = ['Python, Django','React, JavaScript','Node, APIs','Data Science','UX/UI','DevOps','Bases de datos','Machine Learning'];
const ESTADOS_CURSO = ['activo','activo','activo','borrador','inactivo'];

const nombreCompleto = () => pick(NOMBRES) + ' ' + pick(APELLIDOS);

// --- Usuarios: instructores (99 + 1 testeo) y estudiantes (999 + 1 testeo) ---
// El perfil de instructor (bio, especialidades) se embebe en el usuario en vez de
// una coleccion aparte: en NoSQL el perfil pertenece al instructor.
const instructores = [
  { _id: ObjectId(), nombre: 'Profe Testeo', email: 'profe.test@edu.cl', tipo: 'instructor', password: PASS, bio: 'Cuenta de profesor para pruebas.', especialidades: 'Python, Django', fecha_registro: new Date() },
];
for (let i = 1; i <= 99; i++) {
  instructores.push({ _id: ObjectId(), nombre: nombreCompleto(), email: `instructor${i}@edu.cl`, tipo: 'instructor', password: PASS, bio: 'Instructor de ' + pick(TEMAS) + '.', especialidades: pick(ESPECIALIDADES), fecha_registro: new Date() });
}

const estudiantes = [
  { _id: ObjectId(), nombre: 'Alumno Testeo', email: 'alumno.test@edu.cl', tipo: 'estudiante', password: PASS, fecha_registro: new Date() },
];
for (let i = 1; i <= 999; i++) {
  estudiantes.push({ _id: ObjectId(), nombre: nombreCompleto(), email: `estudiante${i}@edu.cl`, tipo: 'estudiante', password: PASS, fecha_registro: new Date() });
}
db.usuarios.insertMany(instructores);
db.usuarios.insertMany(estudiantes);

// --- Cursos: 100, cada uno referencia a un instructor por _id ---
const cursos = [];
for (let i = 1; i <= 100; i++) {
  const tema = pick(TEMAS);
  cursos.push({
    _id: ObjectId(),
    nombre: `${tema} ${pick(NIVELES)}`,
    descripcion: `Curso de ${tema} orientado a la practica.`,
    instructor_id: pick(instructores)._id,
    fecha_inicio: new Date(2026, randInt(0, 11), randInt(1, 28)),
    precio: randInt(0, 1) ? Number((randInt(1999, 9999) / 100).toFixed(2)) : 0,
    portada_url: null,
    estado: pick(ESTADOS_CURSO),
    calificacion: Number((randInt(35, 50) / 10).toFixed(1)),
  });
}
db.cursos.insertMany(cursos);

// --- Lecciones: 3 a 8 por curso. Se guarda un mapa cursoId -> [leccionIds] ---
const lecciones = [];
const leccionesPorCurso = {};
cursos.forEach((curso) => {
  const total = randInt(3, 8);
  leccionesPorCurso[curso._id.toString()] = [];
  for (let n = 1; n <= total; n++) {
    const id = ObjectId();
    leccionesPorCurso[curso._id.toString()].push(id);
    lecciones.push({
      _id: id,
      curso_id: curso._id,
      numero: n,
      orden: n,
      titulo: `Leccion ${n}: ${pick(TEMAS)}`,
      contenido_text: `Contenido de la leccion ${n}. Conceptos y ejercicios.`,
      video_url: randInt(0, 1) ? 'https://example.com/video.mp4' : null,
      duracion_minutos: randInt(8, 60),
    });
  }
});
db.lecciones.insertMany(lecciones);

// --- Inscripciones: cada estudiante en 1 a 5 cursos distintos. El progreso se deriva
//     de cuantas lecciones completo, para ser consistente con leccion:completar ---
const inscripciones = [];
const ESTADOS_INS = ['activo', 'activo', 'completado', 'abandonado'];
function inscribir(estudianteId, cursoId, forzarProgreso) {
  const lecs = leccionesPorCurso[cursoId.toString()] || [];
  const completadasN = forzarProgreso != null ? Math.round((forzarProgreso / 100) * lecs.length) : randInt(0, lecs.length);
  const completadas = lecs.slice(0, completadasN);
  const progreso = lecs.length ? Math.round((completadas.length / lecs.length) * 100) : 0;
  inscripciones.push({
    _id: ObjectId(),
    usuario_id: estudianteId,
    curso_id: cursoId,
    fecha_inscripcion: new Date(),
    estado: progreso === 100 ? 'completado' : pick(ESTADOS_INS),
    progreso,
    lecciones_completadas: completadas,
  });
}
estudiantes.forEach((est) => {
  const n = randInt(1, 5);
  const elegidos = new Set();
  while (elegidos.size < n) elegidos.add(pick(cursos)._id.toString());
  elegidos.forEach((cid) => inscribir(est._id, ObjectId(cid)));
});
db.inscripciones.insertMany(inscripciones);

// --- Comentarios: muestra acotada sobre lecciones al azar ---
const comentarios = [];
const TEXTOS = ['Muy buena leccion.', 'Me quedo una duda.', 'Excelente explicacion.', 'Faltan ejemplos.', 'Clarisimo, gracias.'];
for (let i = 0; i < 800; i++) {
  comentarios.push({ _id: ObjectId(), leccion_id: pick(lecciones)._id, usuario_id: pick(estudiantes)._id, texto: pick(TEXTOS), fecha: new Date() });
}
db.comentarios.insertMany(comentarios);

// --- Calificaciones (fidelidad con el schema relacional): puntaje 0-100 por usuario/leccion.
//     Muestra acotada; la app no la consume hoy, pero conserva la entidad del modelo ---
const calificaciones = [];
for (let i = 0; i < 800; i++) {
  calificaciones.push({ _id: ObjectId(), usuario_id: pick(estudiantes)._id, leccion_id: pick(lecciones)._id, puntaje: randInt(0, 100), fecha: new Date() });
}
db.calificaciones.insertMany(calificaciones);

// --- Indices en los campos de cruce (faltaban; el schema relacional los define) ---
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.cursos.createIndex({ instructor_id: 1 });
db.lecciones.createIndex({ curso_id: 1 });
db.inscripciones.createIndex({ usuario_id: 1 });
db.inscripciones.createIndex({ usuario_id: 1, curso_id: 1 }, { unique: true });
db.comentarios.createIndex({ leccion_id: 1 });
db.calificaciones.createIndex({ usuario_id: 1, leccion_id: 1 });

print('Seed de volumen cargado:');
print('  usuarios: ' + db.usuarios.countDocuments() + ' (instructores ' + db.usuarios.countDocuments({ tipo: 'instructor' }) + ', estudiantes ' + db.usuarios.countDocuments({ tipo: 'estudiante' }) + ')');
print('  cursos: ' + db.cursos.countDocuments());
print('  lecciones: ' + db.lecciones.countDocuments());
print('  inscripciones: ' + db.inscripciones.countDocuments());
print('  comentarios: ' + db.comentarios.countDocuments());
print('  calificaciones: ' + db.calificaciones.countDocuments());
print('Testeo: profe.test@edu.cl / alumno.test@edu.cl (password edu12345)');
