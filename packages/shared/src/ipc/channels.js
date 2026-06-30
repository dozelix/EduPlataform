export const IPC_CHANNELS = {
  // Auth (authHandlers.js — coleccion usuarios)
  AUTH_REGISTER: 'auth:register',
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout',

  // Catalogo (courseHandlers.js)
  CURSO_LISTAR: 'curso:listar',

  // Mi Aprendizaje / inscripciones (learningHandlers.js)
  APRENDIZAJE_LISTAR: 'aprendizaje:listar',
  INSCRIPCION_CREAR: 'inscripcion:crear',

  // Leccion (lessonHandlers.js)
  LECCION_OBTENER: 'leccion:obtener',
  LECCION_COMPLETAR: 'leccion:completar',
  COMENTARIO_LISTAR: 'comentario:listar',
  COMENTARIO_CREAR: 'comentario:crear',
}
