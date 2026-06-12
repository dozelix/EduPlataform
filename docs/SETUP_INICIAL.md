# 🚀 Setup Inicial del Proyecto

## 📋 Pre-requisitos

Antes de empezar, cada miembro del equipo debe tener:

```bash
# Verificar Node.js version (v18+ recomendado)
node --version
npm --version

# Verificar Git
git --version
```

Descargar:
- [Node.js LTS](https://nodejs.org/)
- [Git](https://git-scm.com/)
- IDE: VS Code recomendado

---

## 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/clinic-pc.git
cd clinic-pc
```

---

## 2️⃣ Instalar Dependencias

```bash
npm install
```

### Dependencias Principales

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "electron": "^latest",
    "mongoose": "^8.0.0",
    "vite": "^5.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^latest",
    "typescript": "^5.0.0",
    "eslint": "^latest",
    "prettier": "^latest",
    "vitest": "^latest"
  }
}
```

**Para instalar manualmente:**
```bash
npm install react react-dom
npm install --save-dev vite @vitejs/plugin-react
npm install electron
npm install mongoose
npm install --save-dev typescript eslint prettier
```

---

## 3️⃣ Configurar Variables de Entorno

Crear `.env.local` (copiar desde `.env.example`):

```env
# Mongo DB
MONGODB_URI=mongodb://localhost:27017/clinic-pc
MONGODB_ATLAS_URI=

# API
VITE_API_URL=http://localhost:3000

# Electron
ELECTRON_SERVE=true

# Environment
NODE_ENV=development
```

---

## 4️⃣ Setup de Carpetas Base (Monorepo)

El líder del proyecto debe crear:

```bash
# Crear estructura monorepo
mkdir -p packages/main/src/{ipc,db/models,services}
mkdir -p packages/renderer/src/{features,components,hooks,stores,types,styles,utils}
mkdir -p packages/shared/src/{types,constants,utils,validation,ipc}
mkdir -p tests/{unit,integration,e2e}
mkdir -p docs .github/workflows

# Crear .gitkeep (para que Git trackee directorios vacíos)
touch packages/main/src/db/models/.gitkeep
touch packages/main/src/ipc/.gitkeep
touch packages/renderer/src/features/.gitkeep
touch packages/shared/src/types/.gitkeep
```

---

## 5️⃣ Configurar package.json Root (Monorepo)

Crear `package.json` en la raíz:

```json
{
  "name": "clinic-pc",
  "version": "1.0.0",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "concurrently \"npm:dev:main\" \"npm:dev:renderer\"",
    "dev:main": "cross-env NODE_ENV=development ts-node packages/main/src/index.ts",
    "dev:renderer": "vite --config packages/renderer/vite.config.ts",
    "build": "npm run build:main && npm run build:renderer",
    "build:main": "tsc -p packages/main/tsconfig.json",
    "build:renderer": "vite build --config packages/renderer/vite.config.ts",
    "electron": "electron packages/main/dist/index.js",
    "electron:dev": "concurrently \"npm run dev:renderer\" \"wait-on http://localhost:5173 && npm run electron\"",
    "lint": "eslint packages/*/src --ext .ts,.tsx",
    "format": "prettier --write \"packages/*/src/**/*.{ts,tsx,json,css}\"",
    "test": "vitest"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@typescript-eslint/eslint-plugin": "^latest",
    "concurrently": "^8.0.0",
    "cross-env": "^7.0.0",
    "electron": "^latest",
    "electron-builder": "^latest",
    "eslint": "^latest",
    "prettier": "^latest",
    "ts-node": "^latest",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^latest",
    "wait-on": "^latest"
  }
}
```

Instalar con `npm install` desde la raíz. npm manejará los workspaces automáticamente.

---

## 6️⃣ Configuración de TypeScript (Monorepo)

Crear `tsconfig.json` (raíz):

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler"
  }
}
```

Crear `packages/main/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/src/*"]
    }
  },
  "include": ["src"]
}
```

Crear `packages/renderer/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["../shared/src/*"]
    }
  },
  "include": ["src"]
}
```

Crear `packages/shared/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "lib": ["ES2020"]
  },
  "include": ["src"]
}
```

---

## 7️⃣ Configuración de Vite (Renderer)

Crear `packages/renderer/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  server: {
    port: 5173,
  },
})
```

---

## 8️⃣ Configuración de Electron (Main Process)

Crear `packages/main/src/index.ts`:

```typescript
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { connectDB, disconnectDB } from './db/connection'

let mainWindow: BrowserWindow | null = null
const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const url = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../../renderer/dist/index.html')}`

  mainWindow.loadURL(url)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', async () => {
  await connectDB()
  createWindow()
  // Registrar IPC handlers
  require('./ipc/userHandlers')
  require('./ipc/productHandlers')
})

app.on('window-all-closed', async () => {
  await disconnectDB()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
```

Crear `packages/main/src/preload.ts`:

```typescript
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  invoke: (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args)
  },
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args))
  },
})
```

---

## 9️⃣ Configuración de Mongoose (MongoDB)

Crear `packages/main/src/db/connection.ts`:

```typescript
import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic-pc'
    
    await mongoose.connect(mongoUri)
    console.log('✅ MongoDB conectado')
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    process.exit(1)
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect()
    console.log('✅ MongoDB desconectado')
  } catch (error) {
    console.error('❌ Error desconectando de MongoDB:', error)
  }
}
```

Crear modelo ejemplo `packages/main/src/db/models/User.ts`:

```typescript
import { Schema, model } from 'mongoose'

interface IUser {
  _id?: string
  name: string
  email: string
  password?: string
  createdAt?: Date
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
})

export const User = model<IUser>('User', userSchema)
```

---

## 🔟 IPC Handlers (Main Process)

Crear `packages/main/src/ipc/userHandlers.ts`:

```typescript
import { ipcMain } from 'electron'
import { User } from '../db/models/User'

ipcMain.handle('user:get-all', async () => {
  return await User.find()
})

ipcMain.handle('user:get-by-id', async (_, id: string) => {
  return await User.findById(id)
})

ipcMain.handle('user:create', async (_, userData: any) => {
  const user = new User(userData)
  return await user.save()
})

ipcMain.handle('user:update', async (_, id: string, userData: any) => {
  return await User.findByIdAndUpdate(id, userData, { new: true })
})

ipcMain.handle('user:delete', async (_, id: string) => {
  return await User.findByIdAndDelete(id)
})
```

---

## 1️⃣1️⃣ ESLint + Prettier

Crear `.eslintrc.cjs`:

```javascript
module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintignore'],
  parser: '@typescript-eslint/parser',
  rules: {
    'react-refresh/only-exports-components': 'warn',
  },
}
```

Crear `.prettierrc`:

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

## 1️⃣2️⃣ Primer Servidor de Desarrollo

Desde la raíz del proyecto:

```bash
# Instalar dependencias del monorepo
npm install

# Terminal 1: En dev, inicia ambos procesos en paralelo
npm run dev

# O si prefieres hacerlo manual:
# Terminal 1: Iniciar Vite (React frontend)
npm run dev:renderer

# Terminal 2: Iniciar Electron (Main process con MongoDB)
npm run electron
```

Debería:
1. Compilar `packages/main` con TypeScript
2. Iniciar servidor Vite en http://localhost:5173
3. Conectar MongoDB
4. Abrir ventana de Electron con React app corriendo

---

## 1️⃣3️⃣ Primera Prueba

1. Crear rama
   ```bash
   git checkout -b feature/setup-inicial
   ```

2. Hacer un cambio pequeño (ej: modificar `packages/renderer/src/App.tsx`)

3. Hacer commit
   ```bash
   git commit -m "chore(setup): configuración inicial monorepo completada"
   ```

4. Push
   ```bash
   git push origin feature/setup-inicial
   ```

5. Crear Pull Request en GitHub

6. Pedir revisión a un compañero

---

## 📚 Recursos Útiles

- [Vite Docs](https://vitejs.dev/)
- [Electron Docs](https://www.electronjs.org/docs)
- [Mongoose Docs](https://mongoosejs.com/)
- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/)
- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

---

## ⚠️ Checklist de Setup

- [ ] Node.js 18+ instalado
- [ ] Git configurado con usuario local
- [ ] Repo clonado
- [ ] `npm install` completado desde raíz
- [ ] `.env.local` creado
- [ ] Estructura monorepo `packages/` creada
- [ ] `package.json` (raíz) con workspaces configurado
- [ ] `tsconfig.json` (raíz y packages) creados
- [ ] `packages/renderer/vite.config.ts` creado
- [ ] `packages/main/src/index.ts` creado
- [ ] `packages/main/src/preload.ts` creado
- [ ] Mongoose connection configurada
- [ ] Al menos un IPC handler registrado
- [ ] `npm run dev` funciona correctamente
- [ ] ESLint y Prettier funciona en todo el monorepo

---

**¡Listo! Ahora pueden comenzar el desarrollo en equipo. Lean `REGLAS_COLABORACION.md` para coordinar el trabajo.**
