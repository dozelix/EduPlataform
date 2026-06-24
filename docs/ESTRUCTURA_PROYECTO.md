<<<<<<< HEAD
# 📁 Estructura de Proyecto - EduPlataform Monorepo

**Monorepo Electron + React + MongoDB**

## 🎯 Arquitectura General

```text
EduPlataform/
├── packages/
│   ├── main/                   # Backend: Electron main process + Mongoose
│   │   ├── src/
│   │   │   ├── index.js        # Punto de entrada de la aplicación
│   │   │   ├── preload.js      # IPC bridge seguro
│   │   │   ├── ipc/            # IPC handlers nativos
│   │   │   │   ├── userHandlers.js
│   │   │   │   ├── productHandlers.js
│   │   │   │   └── ...
│   │   │   ├── db/             # Configuración de Mongoose
│   │   │   │   ├── models/
│   │   │   │   │   ├── User.js
│   │   │   │   │   ├── Product.js
│   │   │   │   │   └── ...
│   │   │   │   ├── migrations/
│   │   │   │   ├── seeds/
│   │   │   │   └── connection.js
│   │   │   └── services/       # Lógica de negocio (Servicios)
│   │   │       ├── userService.js
│   │   │       ├── productService.js
│   │   │       └── ...
│   │   └── package.json
│   │
│   ├── frontend/               # Frontend: React + Vite
│   │   ├── src/
│   │   │   ├── components/     # Componentes atómicos estructurados por SRP
│   │   │   │   ├── icons/
│   │   │   │   │   └── Icons.jsx   # Colección unificada de SVGs
│   │   │   │   ├── Sidebar.jsx     # Navegación lateral
│   │   │   │   ├── Topbar.jsx      # Barra superior dinámica
│   │   │   │   └── ...
│   │   │   ├── features/       # Módulos basados en vistas de la aplicación
│   │   │   │   ├── dashboard/
│   │   │   │   │   └── Dashboard.jsx
│   │   │   │   ├── auth/
│   │   │   │   │   └── LoginRegister.jsx
│   │   │   │   └── ...
│   │   │   ├── styles/         # Arquitectura modular de diseño en CSS
│   │   │   │   ├── base/
│   │   │   │   │   ├── reset.css
│   │   │   │   │   └── variables.css
│   │   │   │   ├── components/
│   │   │   │   │   └── Dashboard.css
│   │   │   │   └── styles.css  # Importador central de estilos
│   │   │   └── App.jsx         # Punto de entrada e inicio de React
│   │   ├── public/             # Assets estáticos
│   │   ├── index.html          # Punto de montaje de la aplicación web
│   │   ├── vite.config.js      # Configuración de Vite nativa
│   │   └── package.json
│   │
│   └── shared/                 # Código común e independiente entre paquetes
│       ├── src/
│       │   ├── constants/      # Constantes globales (Canales IPC, Roles)
│       │   └── utils/          # Validaciones y utilidades compartidas
│       └── package.json
│
├── docs/                       # Documentación del proyecto
│   ├── ARQUITECTURA.md
│   ├── IPC_API.md
│   └── WORKFLOW.md
├── .github/
│   └── PULL_REQUEST_TEMPLATE.md
├── package.json                # Root package.json (npm workspaces)
├── package-lock.json           # Lockfile de dependencias unificado
├── eslint.config.js            # Auditoría de código para JS y JSX
├── prettier.config.js          # Formateador de código JavaScript
└── .gitignore
=======
# Estructura del Proyecto — EduPlatform

Referencia rápida de la arquitectura. La documentación completa está en [README.md](../README.md#3-estructura-de-archivos).

---
>>>>>>> 2ccd77a0d0270e543d8a916fd4d713d0ee4a6a7e

## Árbol resumido

```
packages/frontend/src/
├── main.jsx                → importa ./styles/main.css (único compositor)
├── app.jsx                 → modo landing (sin auth) / modo autenticado
├── data/                   → fuente única de datos mock (DRY)
├── components/             → app autenticado (dark theme, prefijo .db-)
├── features/
│   ├── dashboard/          → vista principal autenticada
│   └── landing/            → landing pública (light theme, prefijo .lp-)
└── styles/
    ├── main.css            → compositor de toda la cascada CSS
    ├── index.css / auth.css / Dashboard.css / app.css
    └── landing/            → 8 módulos CSS (SRP)

packages/main/src/
├── index.js                → entrada Electron
├── preload.cjs             → contextBridge → window.api
├── db/connection.js        → connectDB / disconnectDB
├── db/models/User.js       → esquema Mongoose con bcrypt
└── ipc/userHandlers.js     → handlers auth:* y user:*

packages/shared/src/
└── ipc/channels.js         → IPC_CHANNELS (constantes compartidas)
```

---

## Decisiones de diseño clave

**CSS en dos paletas separadas:**
Los estilos del app autenticado usan variables `--color-*` (dark) y prefijo `.db-`. Los estilos de la landing usan variables `--lp-*` (scoped en `.lp`) y prefijo `.lp-`. Esto evita colisiones de cascada al cambiar entre modos.

**Datos en `src/data/`:**
`COURSES` y `STATS` se definían en múltiples archivos. Se centralizaron en `data/courses.js` y `data/stats.js`. Todos los componentes que necesitan estos datos importan desde ahí.

**`LoginRegister.jsx` con prop `onSuccess`:**
El componente acepta un callback `onSuccess(user)` que `app.jsx` usa para pasar del modo landing al modo autenticado. Sin el prop, funciona de forma autónoma.
