# Centro de Documentación — EduPlataform

Guía centralizada de la documentación del proyecto. Solo se listan archivos que existen.

> Empieza por [FUENTE_DE_VERDAD.md](FUENTE_DE_VERDAD.md). Es el documento autoritativo (para
> humanos y para IA): embebe la pauta real del caso (modelo relacional a transformar a NoSQL,
> volumen requerido) y lista las afirmaciones equivocadas de los docs internos. El resto de la
> documentación interna es útil pero tiene errores; no la sigas a ciegas.

---

## Por dónde empezar

**Soy nuevo en el proyecto**
1. [SETUP_INICIAL.md](SETUP_INICIAL.md) — instalación y primeros pasos
2. [ESTRUCTURA_PROYECTO.md](ESTRUCTURA_PROYECTO.md) — layout del monorepo

**Quiero contribuir código**
1. [REGLAS_COLABORACION.md](REGLAS_COLABORACION.md) — git workflow y normas
2. [AUTH_GUIDE.md](AUTH_GUIDE.md) — ejemplo de módulo (autenticación)

**Me interesa la seguridad**
1. [../SECURITY.md](../SECURITY.md) — política y vulnerabilidades conocidas

**Necesito revisar problemas conocidos**
1. [AUDITORIA.md](AUDITORIA.md) — hallazgos verificados (seguridad, funcional, docs)

---

## Documentos disponibles

| Documento | Propósito |
|---|---|
| [SETUP_INICIAL.md](SETUP_INICIAL.md) | Instalación, variables de entorno, puntos de entrada |
| [ESTRUCTURA_PROYECTO.md](ESTRUCTURA_PROYECTO.md) | Estructura del monorepo y decisiones de diseño |
| [AUTH_GUIDE.md](AUTH_GUIDE.md) | Sistema de login/register vía IPC |
| [REGLAS_COLABORACION.md](REGLAS_COLABORACION.md) | Git workflow, commits, PRs, CI |
| [../README.md](../README.md) | Visión general del proyecto |
| [../SECURITY.md](../SECURITY.md) | Política de seguridad y vulnerabilidades |
| [FUENTE_DE_VERDAD.md](FUENTE_DE_VERDAD.md) | Doc autoritativo: pauta real y errores de docs internos |
| [AUDITORIA.md](AUDITORIA.md) | Hallazgos verificados (seguridad, funcional, docs) |
| [MODELO_NOSQL.md](MODELO_NOSQL.md) | Modelo documental (transform relacional a NoSQL) y seed de volumen |

---

## Material del caso

Resumen autoritativo y embebido en [FUENTE_DE_VERDAD.md](FUENTE_DE_VERDAD.md) (léelo primero).

La pauta oficial completa vive en `Documentacion docente/` (versionada como base del equipo; el
`.docx` de requisitos queda fuera por ser duplicado del PDF):

| Archivo (en `Documentacion docente/`) | Qué es |
|---|---|
| `CASO_3_EduPlatform_schema.sql` | Modelo RELACIONAL de origen, a transformar a NoSQL. Guía real de la BD. |
| `CASO_3_EduPlatform_mongodb_existente.js` | Mongo actual, mínimo y roto a propósito (huérfanos intencionales) |
| `CASO_3_EduPlatform_Requerimientos_Frontend.pdf` | Requisitos SOLO de frontend (4 vistas + conversor). Correcto pero parcial: no cubre la BD. |

> Importante: ante cualquier discrepancia, manda el código y la BD real, luego el material del
> caso, y por último los docs internos. El PDF cubre solo frontend; para la BD la guía es
> `schema.sql` + el issue #22 (volumen 100/999/99). Ver [FUENTE_DE_VERDAD.md](FUENTE_DE_VERDAD.md).

---

## Mapa del repositorio

```
EduPlataform/
├─ Documentación
│  ├─ README.md ........................ Visión general
│  ├─ SECURITY.md ..................... Seguridad
│  ├─ Documentacion docente/ ......... Pauta oficial del caso (schema.sql, mongodb_existente.js, PDF)
│  └─ docs/
│     ├─ DOCUMENTACION.md ............. Este archivo (índice)
│     ├─ FUENTE_DE_VERDAD.md .......... Doc autoritativo (pauta real + errores de docs internos)
│     ├─ AUDITORIA.md ................. Hallazgos verificados (seguridad, funcional, docs)
│     ├─ SETUP_INICIAL.md ............. Instalación
│     ├─ ESTRUCTURA_PROYECTO.md ....... Estructura
│     ├─ AUTH_GUIDE.md ................ Autenticación
│     └─ REGLAS_COLABORACION.md ....... Normas de equipo
├─ Código
│  ├─ packages/frontend/ ............. UI React
│  ├─ packages/main/ ................. Electron IPC (pseudo-backend)
│  └─ packages/shared/ ............... Constantes IPC compartidas
└─ Build & Deploy
   ├─ dist-gh/ ....................... Build para GitHub Pages
   └─ package.json ................... Scripts npm (workspaces)
```

---

## Checklist antes de commitear

- [ ] El código cumple [REGLAS_COLABORACION.md](REGLAS_COLABORACION.md)
- [ ] No introduces vulnerabilidades (ver [../SECURITY.md](../SECURITY.md))
- [ ] `npm run format && npm run lint` sin errores
- [ ] Si cambias la estructura, actualizas [ESTRUCTURA_PROYECTO.md](ESTRUCTURA_PROYECTO.md)
- [ ] Si la documentación referencia un archivo, ese archivo existe

---

**Mantenedor**: EduPlataform Team
