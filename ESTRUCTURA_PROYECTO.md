# 📁 Estructura de Proyecto - Aplicación Web + Electron + MongoDB

## 🎯 Arquitectura General

```
proyecto-clinic/
├── .github/
│   ├── workflows/           # CI/CD pipelines
│   └── PULL_REQUEST_TEMPLATE.md
├── packages/                # Monorepo (opcional, para separar renderer y main)
│   ├── main/               # Proceso principal de Electron
│   ├── renderer/           # App React + Vite
│   └── shared/             # Código compartido (tipos, utilidades)
├── src/
│   ├── main/               # Electron main process
│   │   ├── index.ts
│   │   ├── preload.ts      # IPC bridge seguro
│   │   └── services/       # Lógica de negocio
│   ├── renderer/           # Aplicación React
│   │   ├── components/
│   │   │   ├── common/     # Componentes reutilizables
│   │   │   ├── layouts/    # Layouts principales
│   │   │   ├── features/   # Componentes por feature
│   │   │   └── pages/      # Páginas
│   │   ├── pages/
│   │   ├── hooks/          # Custom hooks
│   │   ├── stores/         # Estado global (Zustand/Redux)
│   │   ├── services/       # API calls, IPC communication
│   │   ├── types/          # TypeScript interfaces
│   │   ├── styles/         # CSS/SCSS globales
│   │   ├── utils/          # Utilidades
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── shared/             # Código compartido entre main y renderer
│   │   ├── types/          # Tipos compartidos
│   │   ├── constants/      # Constantes
│   │   ├── utils/          # Funciones compartidas
│   │   └── validation/     # Esquemas (Zod/Yup)
│   └── db/                 # Mongoose models y config
│       ├── models/         # Esquemas MongoDB
│       ├── migrations/     # Scripts de migración
│       ├── seeds/          # Datos iniciales
│       └── connection.ts   # Configuración MongoDB
├── tests/
│   ├── unit/               # Tests unitarios
│   ├── integration/        # Tests de integración
│   ├── e2e/               # Tests end-to-end
│   └── fixtures/          # Datos de prueba
├── docs/                   # Documentación técnica
│   ├── API.md             # Documentación de endpoints
│   ├── ARQUITECTURA.md    # Decisiones de arquitectura
│   ├── SETUP.md           # Setup inicial
│   └── WORKFLOW.md        # Guía de colaboración
├── config/                 # Archivos de configuración
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── electron-builder.yml
│   └── .env.example
├── scripts/                # Scripts de desarrollo/build
│   ├── build.js
│   ├── dev.js
│   └── migrate.js
├── package.json
├── tsconfig.json
├── eslint.config.js
├── prettier.config.js
└── .gitignore
```

## 📦 Estructura Alternativa Simplificada (Si no usan monorepo)

```
proyecto-clinic/
├── src/
│   ├── main/               # Electron main process
│   ├── renderer/           # React app
│   ├── db/                 # Mongoose models
│   └── shared/             # Código compartido
├── public/                 # Assets estáticos
├── tests/
├── docs/
├── config/
├── package.json
└── ...
```

## 🔑 Principios de Diseño

### Separación de Responsabilidades
- **Main Process**: Gestión del sistema de archivos, eventos de window, DB
- **Renderer Process**: UI, estado de la aplicación, experiencia del usuario
- **Shared**: Tipos, constantes, validaciones

### Nombrado de Archivos
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
src/renderer/features/
├── users/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── stores/
│   ├── services/
│   ├── types/
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
