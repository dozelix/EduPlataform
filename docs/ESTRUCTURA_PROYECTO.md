# Estructura del Proyecto — EduPlataform (Caso 3)

Monorepo Electron + React + MongoDB. El frontend implementa las 4 vistas del Caso 3 con un
tema claro tipo Udemy (Tailwind), leyendo de la base `eduplatform` vía IPC.

---

## Árbol vivo

```
packages/frontend/src/
├── main.jsx                → importa tailwind.css y main.css; monta <App>
├── app.jsx                 → login (sin auth) / shell autenticado (nav por estado)
├── components/
│   ├── LoginRegister.jsx   → Vista 1, diseño Udemy (Tailwind), auth:login/register
│   ├── Sidebar.jsx         → nav: Catálogo / Mi Aprendizaje
│   ├── Topbar.jsx          → barra superior
│   └── icons/Icons.jsx     → SVGs del shell
├── features/
│   ├── courses/Catalog.jsx     → Vista 2 (curso:listar, filtro, búsqueda, inscribirse, monedas)
│   ├── learning/MyLearning.jsx → Vista 3 (aprendizaje:listar)
│   └── lesson/Lesson.jsx       → Vista 4 (leccion:* + comentario:*)
└── styles/
    ├── tailwind.css        → entrada Tailwind v4 + orden de capas
    ├── index.css           → tokens --color-* (tema claro), reset, tipografía Inter
    ├── main.css            → compositor del CSS heredado (capa legacy)
    └── Dashboard/Catalog/MyLearning/Lesson.css → estilos por área

packages/main/src/
├── index.js                → entrada Electron (connectDB + carga handlers + ventana)
├── preload.cjs             → contextBridge → window.api
├── db/connection.js        → conecta a mongodb://localhost:27017/eduplatform
├── db/models/Usuario.js    → esquema de la colección `usuarios` (bcrypt)
└── ipc/
    ├── authHandlers.js     → auth:login / auth:register / auth:logout
    ├── courseHandlers.js   → curso:listar
    ├── learningHandlers.js → aprendizaje:listar / inscripcion:crear
    └── lessonHandlers.js   → leccion:obtener / leccion:completar / comentario:listar / comentario:crear

packages/shared/src/
└── ipc/channels.js         → IPC_CHANNELS (solo canales con handler real)

seeds/eduplatform.seed.js   → datos del Caso 3 (con huérfanos intencionales y contraseña dev)
```

---

## Decisiones de diseño clave

**Tema claro tipo Udemy.**
Paleta primario `#3b1c8c`, acento `#a435f0`, fondo `#f7f9fa`, texto `#1c1d1f`, borde `#d1d7dc`,
fuente Inter. El tema global vive en los tokens `--color-*` de `index.css`; las vistas nuevas usan
clases de Tailwind con esos colores.

**Tailwind + CSS heredado conviviendo (capas).**
`tailwind.css` declara `@layer theme, base, legacy, components, utilities`. El CSS plano se importa
en la capa `legacy`: queda por encima del preflight (no lo pisa el reset) y por debajo de las
utilidades (las clases de Tailwind ganan en las vistas nuevas). El preflight está **activo**.

**Modelo único de usuarios.**
La autenticación usa `Usuario` → colección `usuarios` del seed (campos en español: `nombre`,
`email`, `tipo`, `password`). No existe el viejo `User`/`users`.

**Lectura de datos null-safe.**
El seed trae inconsistencias a propósito (instructor/curso/lección huérfanos). Los handlers
resuelven los joins de forma defensiva ("Instructor desconocido", "Curso no disponible") para que
la UI no se rompa.

**Navegación por estado (sin router).**
`app.jsx` maneja la vista activa con `useState` (`activeNav`, `activeLeccionId`); no se usa
react-router.
