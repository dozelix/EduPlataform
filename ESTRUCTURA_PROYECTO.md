# 📁 Estructura de Proyecto - Monorepo Electron + React + MongoDB Local

## 🎯 Arquitectura General (Monorepo)

```
proyecto-clinic/
├── packages/
│   ├── main/                   # Electron main process + Mongoose
│   │   ├── src/
│   │   │   ├── index.ts        # App entry point
│   │   │   ├── preload.ts      # IPC bridge seguro
│   │   │   ├── ipc/            # IPC handlers
│   │   │   │   ├── userHandlers.ts
│   │   │   │   ├── productHandlers.ts
│   │   │   │   └── ...
│   │   │   ├── db/             # Mongoose configuration
│   │   │   │   ├── models/
│   │   │   │   │   ├── User.ts
│   │   │   │   │   ├── Product.ts
│   │   │   │   │   └── ...
│   │   │   │   ├── migrations/
│   │   │   │   ├── seeds/
│   │   │   │   └── connection.ts
│   │   │   └── services/       # Lógica de negocio
│   │   │       ├── userService.ts
│   │   │       ├── productService.ts
│   │   │       └── ...
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── renderer/               # React + Vite Frontend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── common/     # Componentes reutilizables
│   │   │   │   ├── layouts/    # Layouts principales
│   │   │   │   └── features/   # Componentes por feature
│   │   │   ├── features/       # Feature-based modules
│   │   │   │   ├── users/
│   │   │   │   ├── products/
│   │   │   │   └── ...
│   │   │   ├── hooks/          # Custom hooks + API communication
│   │   │   ├── stores/         # Estado global (Zustand)
│   │   │   ├── types/          # TypeScript interfaces
│   │   │   ├── styles/         # CSS/SCSS globales
│   │   │   ├── utils/          # Utilidades
│   │   │   ├── App.tsx
│   │   │   └── main.tsx
│   │   ├── public/             # Assets estáticos
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   └── tsconfig.json
│   │
│   └── shared/                 # Código compartido entre packages
│       ├── src/
│       │   ├── types/          # Tipos compartidos (User, Product, etc)
│       │   ├── constants/      # Constantes globales
│       │   ├── utils/          # Funciones compartidas
│       │   ├── validation/     # Esquemas Zod
│       │   └── ipc/            # Tipos de IPC channels
│       ├── package.json
│       └── tsconfig.json
│
├── tests/
│   ├── unit/                   # Tests unitarios
│   ├── integration/            # Tests de integración
│   └── e2e/                   # Tests end-to-end
├── docs/
│   ├── ARQUITECTURA.md        # Decisiones de arquitectura
│   ├── IPC_API.md            # Documentación de canales IPC
│   └── WORKFLOW.md           # Workflow de desarrollo
├── .github/
│   ├── workflows/            # CI/CD
│   └── PULL_REQUEST_TEMPLATE.md
├── package.json              # Root package.json (workspaces)
├── pnpm-workspace.yaml       # O package-lock.json si usas npm
├── tsconfig.json             # TypeScript config raíz
├── eslint.config.js
├── prettier.config.js
└── .gitignore
```

## 🔄 Flujo de Datos en Monorepo

```
┌─────────────────────────────────────────────────────┐
│           ELECTRON MAIN PROCESS                     │
│  (packages/main - Node.js con Mongoose)            │
│                                                     │
│  ┌──────────────────────────────────────┐          │
│  │ IPC Handlers                         │          │
│  │  • userHandlers.ts                   │          │
│  │  • productHandlers.ts                │          │
│  └──────────────────────────────────────┘          │
│              ↕ (operaciones DB)                    │
│  ┌──────────────────────────────────────┐          │
│  │ Services (Lógica de negocio)        │          │
│  │  • userService.ts                    │          │
│  │  • productService.ts                 │          │
│  └──────────────────────────────────────┘          │
│              ↕ (queries/updates)                   │
│  ┌──────────────────────────────────────┐          │
│  │ Mongoose Models                      │          │
│  │  • User, Product, etc                │          │
│  └──────────────────────────────────────┘          │
│              ↕ (read/write)                        │
│  ┌──────────────────────────────────────┐          │
│  │      MongoDB Local                   │          │
│  └──────────────────────────────────────┘          │
└─────────────────────────────────────────────────────┘
           ↕ (IPC eventos)
┌─────────────────────────────────────────────────────┐
│     RENDERER PROCESS (React + Vite)                │
│     (packages/renderer)                            │
│                                                     │
│  Components → Hooks → Services (IPC calls)         │
│         ↓        ↓         ↓                       │
│    Zustand Store ← IPC response listeners          │
│         ↓                                           │
│    Re-render UI                                    │
└─────────────────────────────────────────────────────┘

packages/shared → Tipos, constantes, validaciones compartidas
```

## 🔑 Principios de Diseño

### Separación de Responsabilidades en Monorepo
- **Main Process** (`packages/main`): Mongoose, operaciones DB, lógica de negocio
- **Renderer Process** (`packages/renderer`): UI, estado local, llamadas IPC
- **Shared** (`packages/shared`): Tipos, constantes, validaciones, esquemas IPC

### IPC Bridge Seguro
- Comunicación controlada entre main y renderer
- Preload script valida tipos
- Sin acceso directo a Node.js desde React

### Sin Backend Separado
- No hay servidor Node.js externo
- MongoDB corre en la máquina local (proceso separado)
- Electron main process se conecta a MongoDB vía Mongoose
- React accede a DB solo a través de IPC handlers
- **Componentes**: `PascalCase.tsx` (ej: `UserCard.tsx`)
- **Hooks**: `camelCase.ts` (ej: `useUserStore.ts`)
- **Utils**: `camelCase.ts` (ej: `formatDate.ts`)
- **Constantes**: `UPPER_SNAKE_CASE.ts` (ej: `API_ENDPOINTS.ts`)
- **Modelos DB**: `PascalCase.ts` (ej: `User.ts`)

### Importaciones
```typescript
// ✅ Correcto
import { UserCard } from '@/components/common/UserCard';
import { useUserStore } from '@/hooks/useUserStore';
import { API_BASE_URL } from '@/shared/constants/API_ENDPOINTS';

// ❌ Evitar
import UserCard from '../../../../components/common/UserCard';
```

## 🗂️ Feature-Based Organization (Recomendado para escalabilidad)

```
packages/renderer/src/features/
├── users/
│   ├── components/         # UI components
│   ├── pages/             # Page components
│   ├── hooks/             # useUsers.ts, useUserForm.ts
│   ├── stores/            # useUserStore.ts (Zustand)
│   ├── services/          # userService.ts (IPC calls)
│   ├── types/             # User types
│   └── index.ts           # Export público

├── products/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── stores/
│   ├── services/
│   ├── types/
│   └── index.ts

└── ...

packages/main/src/
├── ipc/
│   ├── userHandlers.ts    # IPC: get-users, create-user, update-user, delete-user
│   └── productHandlers.ts # IPC: get-products, etc
├── services/
│   ├── userService.ts     # Lógica de negocio
│   └── productService.ts
└── db/models/
    ├── User.ts
    └── Product.ts
```

## 🔗 IPC Communication Pattern

El renderer comunica con main vía IPC (Inter-Process Communication):

```typescript
// En renderer (React component)
const response = await window.api.invoke('user:get-all')

// En main (IPC handler)
ipcMain.handle('user:get-all', async () => {
  return userService.getAllUsers()
})
```

## 🚫 .gitignore Recomendado

```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local

# Build output
dist/
out/
build/

# Logs
*.log
logs/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Electron
electron-builder-effective-config.yaml

# Database
*.db
data/
!data/.gitkeep
```

---

**Próximos pasos:**
1. Revisar `REGLAS_COLABORACION.md`
2. Revisar `SETUP_INICIAL.md`
3. Comenzar con la configuración del proyecto
