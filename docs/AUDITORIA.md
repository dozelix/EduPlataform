# Auditoria de ingenieria — EduPlataform (Caso 3)

Fecha: 2026-06-30. Alcance: contraste del codigo real contra el PDF del caso
(`Documentacion docente/CASO_3_EduPlatform_Requerimientos_Frontend.pdf`) y contra la documentacion
interna. Cada hallazgo lleva etiqueta de confianza:

- `verificado`: leido en el codigo/dato; se cita archivo:linea.
- `contradiccion`: la fuente primaria contradice lo que afirma un doc o un commit.
- `decision`: no es un bug; es un alcance que el equipo debe decidir y explicitar.

Este documento solo registra los hallazgos verificados. No corrige los docs originales; cuando
un punto pide corregir otro archivo, queda anotado en el propio hallazgo.

---

## P0 — Seguridad

### S1. preload.cjs sin whitelist de canales + carga de URL remota con bridge IPC
`verificado` — `packages/main/src/preload.cjs:4` expone `invoke: (channel, ...args) =>
ipcRenderer.invoke(channel, ...args)`: cualquier string es canal valido. En produccion,
`packages/main/src/index.js:32` carga una URL remota (`https://dozelix.github.io/EduPlataform/`)
dentro de la ventana que tiene ese bridge. Combinacion remoto + bridge sin whitelist + sin CSP =
si esa pagina o su cadena de build se compromete, acceso total a los handlers
(`inscripcion:crear`, `comentario:crear`, `leccion:completar`, y los que se agreguen).
La solucion ya esta escrita en `SECURITY.md:43`; sigue sin aplicarse.

### S2. connectDB mata el proceso sin aviso
`verificado` — `packages/main/src/db/connection.js:11` hace `process.exit(1)` si Mongo no
responde. La ventana se cierra sin mensaje al usuario. Ya estaba reportado en `SECURITY.md` y
sigue presente.

---

## P1 — Funcional: rompen el proposito del caso

### F1. "Continuar aprendiendo" y "ultima leccion" no respetan el progreso
`contradiccion` — El PDF abre con el problema central: "estudiantes no saben donde estan en el
curso". La Vista 3 existe para resolverlo, pero:
- `packages/main/src/ipc/learningHandlers.js:54` calcula `ultimaLeccion` como la ultima leccion
  del curso (numero mas alto), no la ultima que vio el estudiante.
- `learningHandlers.js:55` expone `primeraLeccionId` y `MyLearning.jsx:98` lo usa en "Continuar
  aprendiendo": siempre lleva a la leccion 1, sin importar el progreso.

El backend ya rastrea `lecciones_completadas` (`lessonHandlers.js:106`), o sea el dato para
resumir existe; la UI no lo usa. El requisito esta como boton pero no cumple su funcion.
No figura como pendiente en ningun doc.

### F2. No se puede cerrar sesion
`verificado` — `packages/frontend/src/components/Sidebar.jsx:93` renderiza "Cerrar sesion" sin
`onClick` (grep: cero handlers de logout en el frontend). `app.jsx` mantiene `isAuthenticated`
(`:11`) pero nunca expone un camino para volver a false. Una vez dentro, no hay salida.

### F3. Vista de instructor ausente
`decision` — El PDF pide en Contexto y Problematica que "instructores vean quien esta aprendiendo".
Hoy un instructor logueado ve la misma UI de estudiante; el `tipo` se distingue en login
(`authHandlers.js`) pero no cambia nada. `claude.md` lo trata como opcional por no estar entre
las 4 vistas. Es una decision de alcance defendible, pero debe explicitarse con quien evalua,
no asumirse resuelta.

---

## P2 — Documentacion que afirma estados falsos

### D1. El viejo `informe QA.md` daba por resueltos puntos vigentes (RESUELTO: se elimino)
`contradiccion` — El `informe QA.md` afirmaba "historico, ya no aplica", pero seguian vigentes:
F2 (logout sin onClick), falta de sesion global/persistencia, S2 (`process.exit`), y la race
condition de `index.js` (handlers importados en `:50-53`, despues de `createWindow()` en `:47`).
Por estar desactualizado y dar por resueltos esos puntos, el archivo se elimino; este documento
(`AUDITORIA.md`) es su reemplazo verificado. Nota: el antiguo QA#4 (Sidebar con tokens de tema
oscuro) SI estaba obsoleto: los tokens `--color-surface-2`, `--color-text-muted`,
`--color-success`, `--color-danger` existen en `index.css:13-22` con valores del tema claro; los
inline styles de `Sidebar.jsx:62-91` son deuda de mantenibilidad, no rotura visual.

### D2. La rama protegida es `master`, no `main`
`verificado` — `claude.md` repite "nunca pushear/mergear a `main`". No existe rama `main`: la
default del repo es `master` (`origin/HEAD -> origin/master`). La regla protege algo inexistente;
la rama real a proteger es `master`.

### D3. Indicador "DB: CONNECTED" es decorativo
`verificado` — `app.jsx:23` pone `dbStatus` en `connected` solo si existe `window.api`; nunca
consulta la BD. El indicador no refleja el estado real de Mongo.

### D4. Dependencia muerta react-router-dom
`verificado` — `package.json:47` declara `react-router-dom`, pero `ESTRUCTURA_PROYECTO.md:69`
afirma "sin router". La navegacion es por `useState` en `app.jsx`. Contradice la regla de
`claude.md` de no agregar dependencias innecesarias.

### D5. Claim de testing sin tests
`verificado` — README y `package.json` presumen Vitest y `npm test`; no existe ningun archivo de
test en `packages/` (find: cero). El claim es hueco.

---

## P3 — UI pendiente de implementacion

### U1. Controles sin logica en LoginRegister
`verificado` — En `packages/frontend/src/components/LoginRegister.jsx`: los botones de
Google/Facebook (`:266`), "Olvidaste tu contrasena" (`:331`) y "Mantener sesion iniciada" (`:357`)
hoy no tienen logica detras.

Decision del equipo (2026-06-30): Google, Facebook y la recuperacion de contrasena SI se van a
implementar de verdad (OAuth real + flujo de reset). NO son decorativos; no se deben quitar ni
marcar como "no disponibles". Quedan como trabajo pendiente de implementacion. "Mantener sesion
iniciada" depende ademas de tener sesion persistente (ver F2 / SECURITY.md).

---

## Limites de dato del seed (no son bugs; confirmados)

`verificado` — El seed no trae `calificacion` de curso ni `contenido`/`duracion` de leccion, y el
PDF pide calificacion en la tarjeta (Vista 2) y contenido markdown/duracion (Vista 4). La app los
muestra con fallback honesto ("Sin calificacion", "—"). Ademas el contenido se renderiza como
texto plano, no markdown (`Lesson.jsx:142`). Resoluble solo extendiendo el seed (rol backend).

---

## Lo que esta correcto (verificado)

Joins null-safe consistentes ante datos huerfanos en los 4 handlers; uso del driver nativo de
Mongoose para no perder campos con un schema estricto; `auth:login` maneja usuario sin password;
separacion de capas Tailwind/legacy; codigo sin emojis propios, legible y sin sobre-ingenieria
(cumple `claude.md`).

---

## Orden de ataque sugerido

1. S1 (whitelist IPC + CSP) — bajo costo, ya escrito en SECURITY.md.
2. F1 (continuar/ultima leccion usando `lecciones_completadas`) — corazon del caso.
3. F2 (logout funcional: onClick + estado de sesion en app.jsx).
4. D1-D5 (sincerar docs: corregir disclaimer del QA, main->master, quitar react-router-dom,
   agregar tests o retirar el claim).
5. F3 (decidir y documentar alcance de vista de instructor).
