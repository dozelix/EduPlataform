

# 🚀 Setup Inicial del Proyecto

## 📋 Pre-requisitos

Antes de empezar, asegúrate de tener instalado:

* **Node.js** (v18 o superior recomendado) $\rightarrow$ [Descargar LTS](https://nodejs.org/)
* **Git** $\rightarrow$ [Descargar](https://git-scm.com/)
* **IDE**: VS Code recomendado.

```bash
# Verifica las versiones en tu consola
node --version
npm --version
git --version

```

---

## 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/dozelix/EduPlataform.git
cd EduPlataform

```

---

## 2️⃣ Estructura de Carpetas Base (Monorepo)

> ✅ **La estructura ya está creada.** Solo verifica que existan las carpetas:

```bash
# Verificar estructura (ya debe existir)
ls -la packages/main/src/
ls -la packages/frontend/src/
ls -la packages/shared/src/
```

---

## 3️⃣ Configuración del package.json Root

Crea el archivo `package.json` en la raíz del proyecto para gestionar los espacios de trabajo (`workspaces`) y los scripts de desarrollo en paralelo:

```json
{
  "name": "clinic-pc",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev:frontend": "vite packages/frontend",
    "dev:main": "electron packages/main/src/index.js --observe",
    "dev": "concurrently \"npm run dev:frontend\" \"wait-on http://localhost:5173 && npm run dev:main\"",
    "lint": "eslint packages/*/src/**/*.js*",
    "format": "prettier --write \"packages/*/src/**/*.{js,jsx,json,css}\""
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "electron": "^30.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.2.5",
    "vite": "^5.2.0",
    "wait-on": "^7.2.4"
  }
}

```

---

## 4️⃣ Configuración del Frontend (`packages/frontend`)

### `packages/frontend/package.json`

```json
{
  "name": "@clinic/frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1"
  }
}

```

### `packages/frontend/vite.config.js`

Configuración de Vite con resolución de alias nativos de Node.js para conectar el entorno:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared/src')
    }
  },
  server: {
    port: 5173
  }
})

```

---

## 5️⃣ Configuración del Backend (`packages/main`)

### `packages/main/package.json`

```json
{
  "name": "@clinic/main",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.js",
  "dependencies": {
    "mongoose": "^8.4.0"
  }
}

```

### `packages/main/src/index.js`

Proceso principal de Electron que gestiona el ciclo de vida de la aplicación y la conexión a la base de datos utilizando ES Modules nativos:

```javascript
import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB, disconnectDB } from './db/connection.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
let mainWindow = null
const isDev = process.env.NODE_ENV !== 'production'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  const url = isDev 
    ? 'http://localhost:5173' 
    : `file://${path.join(__dirname, '../../frontend/dist/index.html')}`

  mainWindow.loadURL(url)

  if (isDev) mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => { mainWindow = null })
}

app.on('ready', async () => {
  await connectDB()
  createWindow()
  
  // Carga dinámica de módulos IPC
  await import('./ipc/userHandlers.js')
})

app.on('window-all-closed', async () => {
  await disconnectDB()
  if (process.platform !== 'darwin') app.quit()
})

```

### `packages/main/src/preload.js`

Puente seguro (Context Bridge) aislado para comunicar el proceso principal con la interfaz de usuario:

```javascript
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  on: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args))
})

```

---

## 6️⃣ Base de Datos e IPC Handlers

### `packages/main/src/db/connection.js`

```javascript
import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic-pc'
    await mongoose.connect(mongoUri)
    console.log('✅ MongoDB conectado exitosamente')
  } catch (error) {
    console.error('❌ Error en conexión MongoDB:', error)
    process.exit(1)
  }
}

export async function disconnectDB() {
  await mongoose.disconnect()
  console.log('🔌 MongoDB desconectado de forma segura')
}

```

### `packages/main/src/db/models/User.js`

```javascript
import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
})

export const User = model('User', userSchema)

```

### `packages/main/src/ipc/userHandlers.js`

```javascript
import { ipcMain } from 'electron'
import { User } from '../db/models/User.js'

ipcMain.handle('user:get-all', async () => {
  return await User.find({})
})

ipcMain.handle('user:create', async (_, userData) => {
  const user = new User(userData)
  return await user.save()
})

```

---

## 7️⃣ Variables de Entorno y Formato

Crea el archivo `.env.local` en la raíz del proyecto:

```env
MONGODB_URI=mongodb://localhost:27017/clinic-pc
NODE_ENV=development

```

Crea las reglas estandarizadas de estilo visual (`.prettierrc`) en la raíz:

```json
{
  "singleQuote": true,
  "semi": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}

```

---

## 🏃‍♂️ 8. Cómo Iniciar el Entorno de Desarrollo

Sitúate en la carpeta raíz del monorepo (`clinic-pc`) y corre los siguientes comandos:

```bash
# 1. Instalar todas las dependencias cruzadas de los workspaces
npm install

# 2. Iniciar el servidor unificado (Frontend + Electron)
npm run dev

```

> Al ejecutar `npm run dev`, Vite levantará la interfaz web en el puerto `5173`. En paralelo, el orquestador esperará la disponibilidad del puerto para iniciar la ventana de Electron de forma coordinada, asegurando una carga limpia y la conexión simultánea con la base de datos MongoDB.

---

## ⚠️ Checklist de Validación del Setup

* [ ] Node.js v18+ y Git instalados en el sistema local.
* [ ] Dependencias instaladas desde la raíz mediante `npm install`.
* [ ] Archivo `.env.local` configurado con la URI de tu base de datos local.
* [ ] El comando `npm run dev` despliega la ventana nativa de la aplicación de manera fluida y sin errores.