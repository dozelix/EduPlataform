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

```

---

## 🔄 Flujo de Datos en Monorepo

```text
┌─────────────────────────────────────────────────────┐
│               ELECTRON MAIN PROCESS                 │
│         (packages/main - Node.js + Mongoose)        │
│                                                     │
│   ┌──────────────────────────────────────┐          │
│   │ IPC Handlers (Canales String)        │          │
│   │  • userHandlers.js                   │          │
│   │  • productHandlers.js                │          │
│   └──────────────────────────────────────┘          │
│               ↕ (Llamadas directas)                 │
│   ┌──────────────────────────────────────┐          │
│   │ Services (Lógica de Negocio)         │          │
│   │  • userService.js                    │          │
│   │  • productService.js                 │          │
│   └──────────────────────────────────────┘          │
│               ↕ (Consultas/Mutaciones)              │
│   ┌──────────────────────────────────────┐          │
│   │ Mongoose Models                      │          │
│   │  • User, Product, etc.               │          │
│   └──────────────────────────────────────┘          │
│               ↕ (Lectura y Escritura)               │
│   ┌──────────────────────────────────────┐          │
│   │            MongoDB Local             │          │
│   └──────────────────────────────────────┘          │
└─────────────────────────────────────────────────────┘
                    ↕ (Puente IPC)
┌─────────────────────────────────────────────────────┐
│          FRONTEND PROCESS (React + Vite)            │
│                (packages/frontend)                  │
│                                                     │
│   Componentes JSX → Orquestadores de Vista (.jsx)   │
│         ↓                  ↓                        │
│   Eventos de Usuario → window.api.invoke()          │
│         ↓                  ↓                        │
│   Actualización de UI ← Resoluciones Asíncronas     │
└─────────────────────────────────────────────────────┐

packages/shared → Constantes globales y validaciones comunes del ecosistema

```

---

## 🔑 Principios de Diseño

### Separación de Responsabilidades en Monorepo

* **Main Process** (`packages/main`): Acceso a la base de datos a través de Mongoose, procesamiento de payloads pesados, encriptación en backend y lógica de negocio centralizada.
* **Frontend Process** (`packages/frontend`): Renderizado semántico de interfaces de usuario, encapsulamiento de estilos CSS estructurados e invocación asíncrona de eventos de sistema.
* **Shared** (`packages/shared`): Centralización de variables constantes del negocio y utilidades funcionales compartidas.

### IPC Bridge Seguro

* La capa web externa no posee acceso directo al backend de Node.js ni a los módulos internos de Electron.
* El script `preload.js` expone un objeto seguro y controlado (`window.api`) utilizando `contextBridge.exposeInMainWorld`.
* Las llamadas se ejecutan mediante canales semánticos basados en texto evitando fugas de memoria o vulnerabilidades críticas de ejecución.

### Sin Backend Separado

* No se requiere el despliegue de servidores HTTP o REST externos (como Express o Fastify).
* El motor de MongoDB se ejecuta localmente en la máquina del cliente como un proceso independiente del sistema operativo.
* El proceso principal de Electron actúa como el servidor interno monolítico, comunicándose de manera nativa mediante Mongoose.

---

## 🏷️ Convenciones de Nomenclatura

* **Componentes de Interfaz**: `PascalCase.jsx` (ej: `Sidebar.jsx`, `CourseCard.jsx`).
* **Vistas y Controladores**: `PascalCase.jsx` (ej: `Dashboard.jsx`, `LoginRegister.jsx`).
* **Estilos CSS Relacionados**: `PascalCase.css` (ej: `Dashboard.css`).
* **Ficheros de Lógica de Backend**: `camelCase.js` (ej: `userHandlers.js`, `connection.js`).
* **Constantes de Negocio**: `UPPER_SNAKE_CASE.js` (ej: `IPC_CHANNELS.js`).
* **Modelos de Datos**: `PascalCase.js` (ej: `User.js`, `Product.js`).

### Enrutamiento de Módulos (Alias Nativo)

```javascript
// ✅ Correcto (Uso de alias limpios configurados en la herramienta de empaquetado)
import { Sidebar } from '@/components/Sidebar.jsx'
import { IPC_CHANNELS } from '@shared/constants/channels.js'

// ❌ Evitar (Rutas relativas profundas que degradan la legibilidad)
import { Sidebar } from '../../../../components/Sidebar.jsx'

```

---

## 🔗 Patrón de Comunicación IPC

El flujo asíncronizado de datos entre la UI de React y el núcleo de Electron se rige bajo la estructura nativa de promesas:

```javascript
// Desde un componente o vista del Frontend (React)
const cargarUsuarios = async () => {
  const usuarios = await window.api.invoke('user:get-all')
  console.log(usuarios)
}

// Registro del manejador en el Proceso Principal (Electron)
import { ipcMain } from 'electron'
import { userService } from '../services/userService.js'

ipcMain.handle('user:get-all', async () => {
  return await userService.obtenerTodos()
})

```

---

## 🚫 .gitignore Recomendado

```text
# Dependencias de Node
node_modules/
package-lock.json

# Variables de Entorno del Entorno de Desarrollo
.env
.env.local
.env.*.local

# Salidas de Compilación y Empaquetado final
dist/
out/
build/

# Logs del Sistema
*.log
logs/

# Configuraciones locales de Editores e IDEs
.vscode/
.idea/
*.swp

# Archivos temporales de Sistemas Operativos
.DS_Store
Thumbs.db

# Configuración generada por Electron Builder
electron-builder-effective-config.yaml

# Almacenamiento local de la Base de Datos (Si se monta en la raíz)
data/

```