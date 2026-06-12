// CASO 3: EduPlatform - BD MongoDB EXISTENTE
use eduplatform;

db.usuarios.insertMany([
  { _id: ObjectId("507f191e810c19729de87001"), email: "estudiante1@edu.cl", nombre: "Carlos Ramírez", tipo: "estudiante" },
  { _id: ObjectId("507f191e810c19729de87002"), email: "instructor1@edu.cl", nombre: "Prof. Daniela Soto", tipo: "instructor" },
  { _id: ObjectId("507f191e810c19729de87003"), email: "deleted@edu.cl", nombre: "Usuario Eliminado", tipo: "estudiante" }
]);

db.cursos.insertMany([
  { _id: ObjectId("507f191e810c19729de87101"), nombre: "Python Avanzado", instructor_id: ObjectId("507f191e810c19729de87002"), precio: 49.99 },
  { _id: ObjectId("507f191e810c19729de87102"), nombre: "React Fundamentals", instructor_id: ObjectId("507f191e810c19729de87099"), precio: 59.99 }, // ❌ Instructor no existe
  { _id: ObjectId("507f191e810c19729de87103"), nombre: "MongoDB Mastery", instructor_id: ObjectId("507f191e810c19729de87002"), precio: 69.99 }
]);

db.lecciones.insertMany([
  { _id: ObjectId("507f191e810c19729de87201"), curso_id: ObjectId("507f191e810c19729de87101"), numero: 1, titulo: "Introducción", video_url: "https://..." },
  { _id: ObjectId("507f191e810c19729de87202"), curso_id: ObjectId("507f191e810c19729de87101"), numero: 2, titulo: "Variables avanzadas", video_url: "https://..." },
  { _id: ObjectId("507f191e810c19729de87203"), curso_id: ObjectId("507f191e810c19729de87102"), numero: 1, titulo: "Setup", video_url: "https://..." },
  { _id: ObjectId("507f191e810c19729de87204"), curso_id: ObjectId("507f191e810c19729de87999"), numero: 1, titulo: "Curso fantasma", video_url: "https://..." } // ❌ Curso no existe
]);

db.inscripciones.insertMany([
  { _id: ObjectId("507f191e810c19729de87301"), usuario_id: ObjectId("507f191e810c19729de87001"), curso_id: ObjectId("507f191e810c19729de87101"), progreso: 50 },
  { _id: ObjectId("507f191e810c19729de87302"), usuario_id: ObjectId("507f191e810c19729de87001"), curso_id: ObjectId("507f191e810c19729de87999"), progreso: 0 }, // ❌ Curso no existe
  { _id: ObjectId("507f191e810c19729de87303"), usuario_id: ObjectId("507f191e810c19729de87055"), curso_id: ObjectId("507f191e810c19729de87101"), progreso: 25 } // ❌ Usuario no existe
]);

db.comentarios.insertMany([
  { _id: ObjectId("507f191e810c19729de87401"), leccion_id: ObjectId("507f191e810c19729de87201"), usuario_id: ObjectId("507f191e810c19729de87001"), texto: "Muy bueno!" },
  { _id: ObjectId("507f191e810c19729de87402"), leccion_id: ObjectId("507f191e810c19729de87999"), usuario_id: ObjectId("507f191e810c19729de87001"), texto: "Lección fantasma", fecha: new Date() } // ❌ Lección no existe
]);

print("✅ EduPlatform cargada con problemas: instructor huérfano, curso huérfano, inscripción a curso no existente");
