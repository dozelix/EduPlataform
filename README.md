# 📚 EduPlataform

**Plataforma educativa de escritorio nativa construida con Electron, React y MongoDB**

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación y Configuración](#instalación-y-configuración)
- [Desarrollo](#desarrollo)
- [Documentación](#documentación)
- [Seguridad](#seguridad)
- [Contribuciones](#contribuciones)

---

## 📖 Descripción General

**EduPlataform** es una aplicación de escritorio multiplataforma que proporciona una interfaz para la gestión de cursos, usuarios y estadísticas educativas. La arquitectura combina:

- **Frontend**: Interfaz React con Vite
- **Backend**: Electron con IPC (Inter-Process Communication) como pseudo-backend
- **Base de Datos**: MongoDB con Mongoose ODM
- **Distribución**: Electron Builder + GitHub Pages (versión web)

### Características Principales

- Login de estudiantes e instructores
- Catálogo de cursos (filtro por instructor, búsqueda, inscribirse, precio en varias monedas)
- Mi Aprendizaje (progreso por curso, última lección)
- Lección (video, comentarios, marcar como completada, siguiente lección)
- Interfaz tipo Udemy (tema claro, Tailwind)

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Desktop** | Electron 39, Electron Builder |
| **Frontend** | React 18 (JSX), Vite 8 |
| **Styling** | Tailwind v4 + lucide-react (tema claro tipo Udemy) + CSS heredado |
| **Backend** | Node.js, Electron IPC (pseudo-backend) |
| **Base de Datos** | MongoDB, Mongoose 8 (base `eduplatform`) |
| **Development** | Concurrently, Cross-env, ESLint, Prettier |
| **Testing** | Vitest |

---

## 📁 Estructura del Proyecto

```
EduPlataform/
├── packages/
│   ├── frontend/                 # Aplicación React (Vite + Tailwind)
│   │   ├── src/
│   │   │   ├── components/       # LoginRegister, Sidebar, Topbar, icons
│   │   │   ├── features/         # courses/Catalog, learning/MyLearning, lesson/Lesson
│   │   │   ├── styles/           # index, tailwind, main + CSS por vista
│   │   │   ├── app.jsx           # Componente principal
│   │   │   └── main.jsx          # Entry point
│   │   └── vite.config.js        # Configuración Vite (+ plugin Tailwind)
│   ├── main/                     # Proceso principal Electron (pseudo-backend)
│   │   ├── src/
│   │   │   ├── db/               # connection.js + models/Usuario.js
│   │   │   ├── ipc/              # auth/course/learning/lesson Handlers
│   │   │   ├── index.js          # Entry point Electron
│   │   │   └── preload.cjs       # Bridge IPC seguro (window.api)
│   └── shared/                   # Código compartido
│       └── ipc/                  # Definición de canales (channels.js)
├── seeds/                        # Seed del Caso 3 (eduplatform.seed.js)
├── Documentacion docente/        # Pauta oficial del caso (schema.sql, mongodb_existente.js, PDF)
├── docs/                         # Documentación interna (ver docs/FUENTE_DE_VERDAD.md)
├── package.json                  # Root workspace
├── README.md                     # Este archivo
└── SECURITY.md                   # Política de seguridad
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Node.js**: v18+ recomendado
- **npm**: v9+ o superior
- **MongoDB**: Instancia local o remota accesible

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/dozelix/EduPlataform.git
   cd EduPlataform
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   - Crear archivo `.env.local` en la raíz del proyecto (ver [SETUP_INICIAL.md](docs/SETUP_INICIAL.md))
   - Variables requeridas:
     ```env
     MONGODB_URI=mongodb://localhost:27017/eduplatform
     NODE_ENV=development
     ```

4. **Cargar el seed del Caso 3** (con MongoDB corriendo)
   ```bash
   mongosh "mongodb://localhost:27017" < seeds/eduplatform.seed.js
   ```
   - Crea las colecciones `usuarios`, `cursos`, `lecciones`, `inscripciones`, `comentarios`.
   - Login de prueba: `estudiante1@edu.cl` / `edu12345`.

---

## 💻 Desarrollo

### Scripts Disponibles

```bash
# Frontend
npm run dev:frontend              # Inicia Vite dev server (puerto 5173)

# Electron (requiere frontend corriendo)
npm run dev:main                  # Inicia proceso principal Electron

# Desarrollo integrado
npm run dev                        # Inicia frontend + Electron simultáneamente

# Build
npm run build:frontend            # Compila React para producción
npm run build:main                # Build del proceso principal
npm run build                     # Build completo (frontend + main)

# Distribución
npm run electron                  # Ejecuta app compilada
npm run electron:dev              # Ejecuta en modo desarrollo

# Calidad de código
npm run lint                      # Verificar sintaxis (ESLint)
npm run format                    # Formatear código (Prettier)
npm run test                      # Ejecutar tests (Vitest)

# Deployment
npm run deploy                    # Deploy a GitHub Pages
```

### Flujo de Desarrollo

1. **Iniciar dev servers**
   ```bash
   npm run dev
   ```
   Esto inicia simultáneamente:
   - Vite dev server (http://localhost:5173)
   - Electron app conectada al dev server

2. **Realizar cambios**
   - Los cambios en React se reflejan automáticamente (Hot Reload)
   - Los cambios en el proceso principal requieren reinicio de Electron

3. **Lint y Formato**
   ```bash
   npm run format && npm run lint
   ```

---

## 📚 Documentación

Toda la documentación centralizada está en el directorio [docs/](docs/):

| Documento | Propósito |
|-----------|-----------|
| [FUENTE_DE_VERDAD.md](docs/FUENTE_DE_VERDAD.md) | Empieza aquí. Pauta real (relacional a NoSQL, volumen) y errores de los docs internos |
| [MODELO_NOSQL.md](docs/MODELO_NOSQL.md) | Modelo documental y seed de volumen (100 cursos / 999 estudiantes / 99 profesores) |
| [SETUP_INICIAL.md](docs/SETUP_INICIAL.md) | Guía de instalación y configuración inicial |
| [ESTRUCTURA_PROYECTO.md](docs/ESTRUCTURA_PROYECTO.md) | Descripción detallada de estructura y convenciones |
| [AUTH_GUIDE.md](docs/AUTH_GUIDE.md) | Sistema de autenticación y login/register |
| [DOCUMENTACION.md](docs/DOCUMENTACION.md) | Índice central de la documentación |
| [REGLAS_COLABORACION.md](docs/REGLAS_COLABORACION.md) | Normas para contribuciones y código |
| [SECURITY.md](SECURITY.md) | Política de seguridad y vulnerabilidades |
| [AUDITORIA.md](docs/AUDITORIA.md) | Auditoría: hallazgos verificados (seguridad, funcional, docs) |

### Resumen de Problemas Conocidos

Revisar [docs/AUDITORIA.md](docs/AUDITORIA.md) para lista de:
- ❌ Problemas críticos (seguridad IPC)
- ⚠️ Problemas de diseño (CSS duplicado, colisiones)
- 🔧 Áreas en construcción

---

## 🔐 Seguridad

**⚠️ Aplicación en desarrollo** — No usar en producción sin revisar [SECURITY.md](SECURITY.md)

### Consideraciones Críticas

1. **IPC Whitelist**: Los canales IPC deben validarse estrictamente
2. **Variables de Entorno**: Nunca commitear credenciales en `.env`
3. **MongoDB**: Usar autenticación fuerte en producción
4. **Electron**: Deshabilitar dev tools en builds de producción

Para más detalles ver [SECURITY.md](SECURITY.md)

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Leer [REGLAS_COLABORACION.md](docs/REGLAS_COLABORACION.md)
2. Fork el repositorio
3. Crear rama feature: `git checkout -b feature/tu-feature`
4. Commit con mensajes descriptivos: `git commit -am 'Agregar nueva feature'`
5. Push a la rama: `git push origin feature/tu-feature`
6. Abrir Pull Request

### Normas de Código

- Ejecutar `npm run format` antes de commit
- Pasar `npm run lint` sin errores
- Tests: `npm run test`

---

## 📄 Licencia

Este proyecto es privado. Consultar con los maintainers para permisos de uso.

---

## 👥 Maintainers

- [@dozelix](https://github.com/dozelix) - Creador principal

---

## 📞 Soporte

Para reportar bugs o solicitar features:
- Crear un issue en GitHub
- Incluir pasos para reproducir
- Especificar versión de Node.js y SO
- Adjuntar screenshots si es relevante

---

**Última actualización**: 2025-12-23
