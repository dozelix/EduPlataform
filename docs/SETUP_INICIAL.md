# Setup Inicial del Proyecto — EduPlataform

## Pre-requisitos

* **Node.js** v18 o superior → [Descargar LTS](https://nodejs.org/)
* **MongoDB** local (mongod) o accesible por URI → [Instalar](https://www.mongodb.com/docs/manual/installation/)
* **Git** → [Descargar](https://git-scm.com/)
* **IDE**: VS Code recomendado.

```bash
node --version
npm --version
git --version
```

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/dozelix/EduPlataform.git
cd EduPlataform
```

---

## 2. Estructura de carpetas (monorepo)

> La estructura ya está creada. Verifica que existan:

```bash
ls -la packages/main/src/
ls -la packages/frontend/src/
ls -la packages/shared/src/
```

Detalle en [ESTRUCTURA_PROYECTO.md](ESTRUCTURA_PROYECTO.md).

---

## 3. Instalar dependencias

Desde la raíz (npm workspaces instala todos los paquetes de una vez):

```bash
npm install
```

El proyecto usa, entre otros: Electron 39, React 18, Vite 8, Tailwind v4 (`@tailwindcss/vite`),
lucide-react, Mongoose 8, bcryptjs, ESLint, Prettier, Vitest (ver `package.json` para versiones).

---

## 4. Base de datos y seed (Caso 3)

1. **MongoDB debe estar corriendo** en `localhost:27017`. `connection.js` conecta por defecto a la
   base `eduplatform` (no hace falta `.env.local`; si lo creas, define `MONGODB_URI`).
2. **Cargar el seed** una vez (si la base está vacía). El archivo usa helpers de mongosh (`use`),
   así que se carga por stdin:

```bash
mongosh "mongodb://localhost:27017" < seeds/eduplatform.seed.js
```

El seed crea las colecciones del caso (`usuarios`, `cursos`, `lecciones`, `inscripciones`,
`comentarios`) con sus inconsistencias intencionales y la contraseña de desarrollo `edu12345`.

Para el dataset de volumen del issue #22 (100 cursos, 999 estudiantes, 99 profesores + 2 usuarios
de testeo), usar el seed de volumen (idempotente). Detalle del modelo en
[MODELO_NOSQL.md](MODELO_NOSQL.md):

```bash
mongosh "mongodb://localhost:27017" < seeds/eduplatform.volume.seed.js
```

---

## 5. Puntos de entrada (referencia)

### `packages/main/src/index.js`

Proceso principal de Electron. En desarrollo carga Vite (`localhost:5173`); en producción
carga el bundle publicado en GitHub Pages.

```javascript
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  const url = isDev
    ? 'http://localhost:5173'
    : 'https://dozelix.github.io/EduPlataform/'

  mainWindow.loadURL(url)
}

app.on('ready', async () => {
  await connectDB()
  createWindow()
  await import('./ipc/authHandlers.js')
  await import('./ipc/courseHandlers.js')
  await import('./ipc/learningHandlers.js')
  await import('./ipc/lessonHandlers.js')
})
// Nota: el codigo real registra los handlers DESPUES de createWindow; hay una
// race condition conocida (ver docs/AUDITORIA.md). Lo ideal es registrarlos antes.
```

### `packages/main/src/preload.cjs`

Puente seguro (Context Bridge). Debe tener extensión `.cjs` porque el paquete `main` es
ES Module y el preload usa `require()`.

```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args))
})
```

### `packages/main/src/db/connection.js`

```javascript
import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduplatform'
    await mongoose.connect(mongoUri)
    console.log('MongoDB conectado')
  } catch (error) {
    console.error('Error conectando a MongoDB:', error)
    process.exit(1)
  }
}
```

### `packages/main/src/db/models/Usuario.js`

Modelo de la colección `usuarios` del seed (campos en español, `password` con bcryptjs):

```javascript
import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

const usuarioSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  tipo: { type: String, enum: ['estudiante', 'instructor'], default: 'estudiante' },
  password: { type: String, minlength: 6, select: false },
}, { collection: 'usuarios' })

usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

usuarioSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

export const Usuario = model('Usuario', usuarioSchema)
```

Detalle de autenticación en [AUTH_GUIDE.md](AUTH_GUIDE.md).

---

## 6. Iniciar el entorno de desarrollo

Desde la raíz del monorepo (`EduPlataform`):

```bash
# Frontend + Electron coordinados (Vite en :5173, luego abre la ventana de Electron)
npm run dev
```

Otros scripts útiles (ver `package.json` raíz):

```bash
npm run dev:frontend   # solo Vite
npm run lint           # ESLint
npm run format         # Prettier
npm run test           # Vitest
```

---

## Checklist de validación del setup

* [ ] Node.js v18+ y Git instalados.
* [ ] MongoDB corriendo en `localhost:27017`.
* [ ] `npm install` ejecutado desde la raíz.
* [ ] Seed cargado en la base `eduplatform` (`mongosh ... < seeds/eduplatform.seed.js`).
* [ ] El bridge está en `packages/main/src/preload.cjs` (extensión `.cjs`).
* [ ] `npm run dev` abre la ventana de Electron, conecta a la BD y el login entra con
  `estudiante1@edu.cl` / `edu12345`.
