# Modelo NoSQL — EduPlatform

Transformacion del esquema relacional de origen (`Documentacion docente/CASO_3_EduPlatform_schema.sql`)
a un modelo documental en MongoDB. Estrategia: **referencias** (no documentos embebidos para
las relaciones de alta cardinalidad), por dos razones: el pseudo-backend ya consulta por
colecciones separadas, y a 999 estudiantes / 100 cursos embeber inscripciones o lecciones haria
los documentos inmanejables.

## Mapa relacional -> documental

| Tabla relacional | Decision en Mongo |
|---|---|
| `usuarios` | Coleccion `usuarios`. El perfil de instructor (`bio`, `especialidades`) se **embebe** en el propio usuario `tipo: instructor`, en vez de una coleccion `instructores` aparte (el perfil pertenece al instructor). |
| `instructores` | Eliminada como tabla; sus campos viven embebidos en `usuarios`. |
| `cursos` | Coleccion `cursos`. `instructor_id` **referencia** a `usuarios._id`. |
| `lecciones` | Coleccion `lecciones`. `curso_id` referencia a `cursos._id`. |
| `estudiantes_cursos` | Coleccion `inscripciones`. Referencia `usuario_id` y `curso_id`. Las lecciones completadas se guardan como arreglo de ObjectId (`lecciones_completadas`) dentro de la inscripcion. |
| `calificaciones` | Coleccion `calificaciones` (`usuario_id`, `leccion_id`, `puntaje`). |
| `comentarios` | Coleccion `comentarios`. Referencia `leccion_id` y `usuario_id`. |

## Forma de cada documento

```
usuarios:      { _id, email, nombre, tipo: 'estudiante'|'instructor',
                 password (bcrypt), fecha_registro,
                 bio, especialidades }            // bio/especialidades solo en instructores
cursos:        { _id, nombre, descripcion, instructor_id -> usuarios._id,
                 fecha_inicio, precio, portada_url, estado, calificacion }
lecciones:     { _id, curso_id -> cursos._id, numero, orden, titulo,
                 contenido_text, video_url, duracion_minutos }
inscripciones: { _id, usuario_id -> usuarios._id, curso_id -> cursos._id,
                 fecha_inscripcion, estado, progreso, lecciones_completadas: [leccion._id] }
comentarios:   { _id, leccion_id -> lecciones._id, usuario_id -> usuarios._id, texto, fecha }
calificaciones:{ _id, usuario_id -> usuarios._id, leccion_id -> lecciones._id, puntaje, fecha }
```

`progreso` de cada inscripcion se deriva de `lecciones_completadas` / total de lecciones del
curso, consistente con lo que recalcula el handler `leccion:completar`.

## Indices (faltaban; el schema relacional los define)

- `usuarios.email` (unico)
- `cursos.instructor_id`
- `lecciones.curso_id`
- `inscripciones.usuario_id` y `inscripciones.{usuario_id, curso_id}` (unico, evita inscripcion duplicada)
- `comentarios.leccion_id`
- `calificaciones.{usuario_id, leccion_id}`

## Seed de volumen

Archivo: `seeds/eduplatform.volume.seed.js`. Idempotente (limpia antes de sembrar). Genera el
volumen del issue #22: 100 cursos, 999 estudiantes, 99 profesores, mas 1 profesor de testeo
(`profe.test@edu.cl`) y 1 alumno de testeo (`alumno.test@edu.cl`), password `edu12345`.

```bash
mongosh "mongodb://localhost:27017" < seeds/eduplatform.volume.seed.js
```

Para el dataset minimo con inconsistencias intencionales del caso (datos huerfanos), usar en su
lugar `seeds/eduplatform.seed.js`.
