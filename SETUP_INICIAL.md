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

## 4️⃣ Setup de Carpetas Base

El líder del proyecto debe crear:

```bash
# Crear estructura base
mkdir -p src/main src/renderer src/db src/shared
mkdir -p tests/{unit,integration,e2e}
mkdir -p docs config scripts public

# Crear .gitkeep en carpetas importantes (para que Git trackee directorios vacíos)
touch src/main/.gitkeep
touch src/renderer/.gitkeep
touch src/db/models/.gitkeep
```

---

## 5️⃣ Configuración de TypeScript

Crear `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/renderer/components/*"],
      "@/hooks/*": ["./src/renderer/hooks/*"],
      "@/stores/*": ["./src/renderer/stores/*"],
      "@/types/*": ["./src/shared/types/*"],
      "@/utils/*": ["./src/shared/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 6️⃣ Configuración de Vite

Crear `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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

## 7️⃣ Configuración de Electron

Crear `src/main/index.ts`:

```typescript
import { app, BrowserWindow } from 'electron'
import path from 'path'
import isDev from 'electron-is-dev'

let mainWindow: BrowserWindow | null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.ts'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const url = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../renderer/index.html')}`

  mainWindow.loadURL(url)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
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

---

## 8️⃣ Configuración de Mongoose (MongoDB)

Crear `src/db/connection.ts`:

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

Crear modelo ejemplo `src/db/models/User.ts`:

```typescript
import { Schema, model } from 'mongoose'

interface IUser {
  name: string
  email: string
  password: string
  createdAt: Date
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

export const User = model<IUser>('User', userSchema)
```

---

## 9️⃣ Scripts en package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "electron": "electron .",
    "electron-dev": "concurrently \"npm run dev\" \"wait-on http://localhost:5173 && electron .\"",
    "electron-build": "npm run build && electron-builder",
    "lint": "eslint src --ext .ts,.tsx",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\"",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

---

## 🔟 ESLint + Prettier

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

## 1️⃣1️⃣ Primer Servidor de Desarrollo

```bash
# Terminal 1: Iniciar Vite (React frontend)
npm run dev

# Terminal 2 (en otra ventana): Iniciar Electron
npm run electron

# O en 1 sola terminal:
npm run electron-dev
```

Debería abrir una ventana de Electron con la app React corriendo.

---

## 1️⃣2️⃣ Primera Prueba

1. Crear rama
   ```bash
   git checkout -b feature/setup-inicial
   ```

2. Hacer un cambio pequeño (ej: agregar texto en src/renderer)

3. Hacer commit
   ```bash
   git commit -m "chore(setup): configuración inicial completada"
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

---

## ⚠️ Checklist de Setup

- [ ] Node.js 18+ instalado
- [ ] Git configurado con usuario local
- [ ] Repo clonado
- [ ] `npm install` completado
- [ ] `.env.local` creado
- [ ] Carpetas base creadas
- [ ] `package.json` configurado
- [ ] `tsconfig.json` creado
- [ ] `vite.config.ts` creado
- [ ] Primer servidor de desarrollo funciona
- [ ] ESLint y Prettier funcionan

---

**¡Listo! Ahora pueden comenzar el desarrollo en equipo. Lean `REGLAS_COLABORACION.md` para coordinar el trabajo.**
