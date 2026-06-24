

# 👥 Reglas de Colaboración - Equipo de 3 Desarrolladores

## 🔀 Git Workflow (GitHub Flow Estricto)

### Ramas de Desarrollo

```
main                  # Rama de producción protegida (NUNCA escribir código aquí)
develop              # Rama de desarrollo principal
├── feature/*        # Nuevas funcionalidades (ej: feature/dashboard-ui)
├── bugfix/*         # Corrección de errores (ej: bugfix/auth-error)
├── refactor/*       # Optimización de lógica (ej: refactor/ipc-security)
└── docs/*           # Cambios en manuales (ej: docs/update-security)

```

---

## 🔒 Las 3 Reglas de Oro contra Merges Directos

### 1️⃣ main es Sagrada y Protegida

Está **estrictamente prohibido** hacer `git commit` o `git merge` local directamente sobre `main`. El código solo entra a `main` a través de Pull Requests en la interfaz de GitHub, tras superar la revisión del linter y la aprobación del equipo.

### 2️⃣ Flujo Obligatorio por Tarea (Sin excepciones)

1. **Sincronizar y crear rama local:**
```bash
git checkout main
git pull origin main
git checkout -b feature/nombre-de-la-tarea

```


2. **Hacer Push de la rama al servidor remoto:**
```bash
git push origin feature/nombre-de-la-tarea

```


3. **Crear Pull Request (PR) en GitHub:**
* No puedes mergear tu propio código.
* Se requiere obligatoriamente **al menos 1 aprobación** de un compañero de equipo.



### 3️⃣ Integrar cambios mediante Rebase (Evita "Merge Commits" sucios)

Para mantener un historial lineal y limpio, antes de solicitar la revisión de tu PR, integra los últimos cambios de `main` en tu rama usando `rebase`:

```bash
git fetch origin
git rebase origin/main

# Si hay conflictos, se resuelven y luego:
git rebase --continue

# Subir los cambios limpios a tu PR de forma segura
git push origin feature/nombre-de-la-tarea --force-with-lease

```

---

## 📝 Convención de Commits Semánticos

Cada commit debe representar una unidad lógica de trabajo usando JavaScript puro. El formato es: `<tipo>(<scope>): <descripción breve>`

### Tipos Permitidos

* `feat`: Nueva funcionalidad (ej: `feat(auth): agregar login con cookies`)
* `fix`: Corrección de un fallo (ej: `fix(ipc): resolver cuelgue en userHandlers`)
* `style`: Formateo estético, ESLint o Prettier (ej: `style(frontend): formatear Dashboard.css`)
* `refactor`: Cambios de código sin alterar su comportamiento (ej: `refactor(db): simplificar esquema de mongoose`)
* `chore`: Tareas de mantenimiento o dependencias (ej: `chore(root): actualizar version de electron`)

```
✓ feat(dashboard): renderizar tarjetas de métricas analíticas
✓ fix(db): corregir timeout al conectar con Mongoose
✗ fixed bug and added styles
✗ wip

```

---

## 🏗️ Estructura de Trabajo Paralelo (Vertical Slicing)

Para evitar conflictos de fusión (merge conflicts) en un equipo de 3 desarrolladores, trabajaremos bajo el principio de **Features Verticales Completas**. Cada desarrollador es dueño absoluto de su módulo de punta a punta.

**Estrategia de asignación:**

* **Desarrollador A (Feature Módulo Usuarios):**
* `packages/frontend/src/features/users/`
* `packages/main/src/db/models/User.js`
* `packages/main/src/services/userService.js`


* **Desarrollador B (Feature Módulo Productos):**
* `packages/frontend/src/features/products/`
* `packages/main/src/db/models/Product.js`
* `packages/main/src/services/productService.js`


* **Desarrollador C (Componentes Comunes y Layout Estructural):**
* `packages/frontend/src/components/` (Sidebar, Topbar, Icons)
* `packages/frontend/src/styles/`
* `packages/shared/`



---

## 🗨️ Protocolo para Pull Requests (PR)

Al abrir un PR en GitHub, utiliza la siguiente plantilla simplificada en la descripción:

```markdown
## 📝 Descripción
Breve resumen del propósito de este cambio.

## 🧱 Cambios Realizados
- [frontend] Modificación o creación de componentes `.jsx`
- [main] Nuevos endpoints e IPC handlers `.js` o modelos de Mongoose

## 🧪 Pruebas Realizadas
- [ ] Ejecutado `npm run lint` sin advertencias.
- [ ] Ejecutado `npm run dev`, levantando frontend y Electron correctamente.

```

---

## 🔍 Checklist Obligatorio Antes del Push

Antes de empujar tu rama para revisión, ejecuta la suite de validación local desde la raíz del proyecto:

```bash
# 1. Asegurar código limpio y con estilo unificado
npm run format
npm run lint

# 2. Verificar que no rompa la compilación nativa ni el empaquetado
npm run dev

```

Si todo responde correctamente en verde, puedes enviar tu código a revisión en GitHub confiando en que mantendrás la estabilidad del monorepo.