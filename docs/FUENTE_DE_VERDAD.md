# Fuente de verdad — EduPlatform (para humanos y para IA)

Lee esto ANTES de fiarte de cualquier otro doc interno del repo. Varios documentos
(`claude.md`, partes de `README.md` y `DOCUMENTACION.md`) tienen afirmaciones
desactualizadas o equivocadas; se listan abajo en "No te fies de". Si trabajas con IA, dale
ESTE archivo como contexto, no el resto a ciegas.

Motivo de existir: el material oficial del caso vive en `Documentacion docente/`, que es LOCAL y
esta en `.gitignore` (no llega por git). Por eso lo esencial de esa pauta se embebe aqui, en un
archivo si versionado, para que todo el equipo y cualquier IA tengan la misma base.

---

## Jerarquia de fuentes (de mas a menos confiable)

1. El codigo y la BD real (lo que de verdad corre). Verificar contra esto, no contra los docs.
2. Material oficial del caso en `Documentacion docente/` (LOCAL, gitignored; esencial embebido abajo):
   - `CASO_3_EduPlatform_schema.sql` — modelo RELACIONAL de origen (el "antes" a transformar a NoSQL).
   - `CASO_3_EduPlatform_mongodb_existente.js` — Mongo actual, minimo y roto A PROPOSITO (el "sistema confuso" a arreglar; trae huerfanos intencionales).
   - `CASO_3_EduPlatform_Requerimientos_Frontend.pdf` — requisitos SOLO de frontend (4 vistas + conversor). Correcto pero PARCIAL: no cubre la base de datos.
3. Issues de GitHub (#21-#24) — tareas concretas y asignaciones.
4. Docs internos (`claude.md`, etc.) — utiles pero con errores; ver abajo.

El PDF de requisitos NO es la guia de la base de datos. Es frontend. La guia de BD es el
`schema.sql` + el issue #22.

---

## El trabajo real de BD: transformar relacional a NoSQL

El caso entrega un esquema SQL (relacional) y un Mongo "existente" roto. La tarea es disenar bien
el modelo documental y poblarlo. El Mongo actual es una transformacion INCOMPLETA del SQL.

Falta migrar (lo tiene el SQL, no esta en Mongo):

| Origen SQL | Estado en Mongo actual |
|---|---|
| Tabla `calificaciones` (puntaje 0-100 por usuario/leccion) | No existe. Es la "calificacion" que pide el PDF (Vista 2). |
| Tabla `instructores` (bio, especialidades) | No existe; el instructor es un usuario plano sin perfil. |
| `lecciones.contenido_text`, `duracion_minutos`, `orden` | Ausentes (son los "Sin contenido" / "—" que muestra la app). |
| `cursos.descripcion`, `fecha_inicio`, `portada_url`, `estado` | Ausentes. |
| `estudiantes_cursos.fecha_inscripcion`, `estado` | Ausentes (la inscripcion solo guarda progreso). |
| `usuarios.fecha_registro`, tipo `admin` | Ausentes (el modelo solo admite estudiante/instructor). |

Importante: que falten estos campos NO es un "limite del dato del seed". El origen relacional
los tiene; es la migracion a medio hacer.

---

## Volumen requerido (issue #22, asignado a EchoBit3 / Jean)

Sembrar: **100 cursos, 999 estudiantes, 99 profesores + 1 profesor de testeo + 1 alumno de testeo**.

Discrepancia a tener clara: el PDF dice "100 cursos y 5000 estudiantes". El numero operativo
para sembrar es el del issue #22 (999 estudiantes / 99 profesores), NO el del PDF. No sembrar
segun el PDF.

Estado: SEMBRADO (verificado en vivo). La BD tiene 100 cursos, 1000 estudiantes (999 + 1 testeo)
y 100 instructores (99 + 1 testeo). Seed: `seeds/eduplatform.volume.seed.js`. Usuarios de prueba:
`profe.test@edu.cl` / `alumno.test@edu.cl` (password `edu12345`).

---

## Modelo de datos NoSQL (resuelto)

La transformacion del schema relacional a documental esta decidida y documentada en
[MODELO_NOSQL.md](MODELO_NOSQL.md): se modela por **referencias**, el perfil de instructor
(`bio`, `especialidades`) se embebe en `usuarios`, y se crearon los indices de los campos de
cruce que faltaban (`instructor_id`, `curso_id`, `usuario_id`, `leccion_id`).

---

## No te fies de (correcciones verificadas contra codigo/BD/GitHub)

- `claude.md`: "el seed de volumen (#22) NO es nuestro, es backend ajeno" -> FALSO. El issue #22
  esta asignado a EchoBit3 (Jean) en GitHub, milestone sprint 2.
- `claude.md`: "Sin calificacion / Sin contenido = limite del dato, no omision" ->
  FALSO. El SQL de origen tiene `calificaciones`, `contenido_text` y `duracion_minutos`.
- `claude.md`: "el viejo `users` se elimino" -> la coleccion `users` sigue en la BD (vacia, residuo).
- `claude.md`: "nunca pushear/mergear a `main`" -> no existe rama `main`; la default es `master`.
- (El viejo `informe QA.md` se elimino por estar desactualizado y dar por resueltos puntos que
  siguen vigentes; su reemplazo verificado es `docs/AUDITORIA.md`.)
- `README.md` / `package.json`: "Testing: Vitest", `npm test` -> no existe ningun test.
- El PDF de requisitos: util pero SOLO frontend; no es la guia de la BD.

Detalle de hallazgos de frontend en [AUDITORIA.md](AUDITORIA.md).

---

## Estado de conexion a la BD (verificado)

Conecta completo: `mongod` escuchando en `localhost:27017`, base `eduplatform`, 5 colecciones.
Lo que falta NO es la conexion, es el contenido: la transformacion completa del modelo y el volumen.
