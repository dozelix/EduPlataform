# 👥 Reglas de Colaboración - Equipo de 3 Desarrolladores

## 🔀 Git Workflow (GitHub Flow Simplificado)

### Ramas Principales
```
main                    # Producción (protegida)
├── feature/*          # Nuevas features
├── bugfix/*           # Correcciones de bugs
├── refactor/*         # Mejoras de código
└── docs/*             # Documentación
```

### Convención de Nombrado de Ramas
```
feature/user-authentication
feature/dashboard-ui
bugfix/login-error-handling
refactor/database-queries
docs/api-documentation

# NO PERMITIDO
✗ feature/john-work
✗ fix/stuff
✗ new-code
```

### Flujo por Tarea

1. **Crear rama desde `main`**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/mi-feature
   ```

2. **Desarrollar en tu rama**
   - Commits descriptivos y frecuentes
   - Un commit = una unidad lógica de trabajo

3. **Hacer Push**
   ```bash
   git push origin feature/mi-feature
   ```

4. **Crear Pull Request (PR)**
   - Incluir descripción clara
   - Referenciar issues relacionados (#123)
   - Esperar al menos 1 aprobación de compañero

5. **Code Review**
   - Todos deben revisar PRs de otros
   - Sugerencias constructivas
   - Aprobar solo si está listo para merge

6. **Merge y Delete**
   ```bash
   git merge feature/mi-feature
   git push origin main
   git branch -d feature/mi-feature
   ```

---

## 📝 Convención de Commits

### Formato Recomendado
```
<tipo>(<scope>): <descripción breve>

<descripción detallada (opcional)>

<footer (opcional)>
```

### Tipos
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato/eslint
- `refactor`: Refactorización sin cambios funcionales
- `perf`: Mejoras de rendimiento
- `test`: Agregar o actualizar tests
- `chore`: Cambios en build, deps, etc.

### Ejemplos
```
✓ feat(auth): agregar autenticación con JWT
✓ fix(db): resolver error de conexión a MongoDB
✓ docs(setup): actualizar instrucciones de instalación
✓ refactor(components): simplificar lógica de renderizado
✓ test(user-service): agregar tests unitarios

✗ fixed stuff
✗ wip
✗ asdasd
```

---

## 🔒 Reglas Principales

### 1️⃣ NUNCA trabajar directamente en `main`
- `main` es solo para código probado y revisado
- Todas las features van por PR

### 2️⃣ Una rama = Una feature/bugfix
```bash
✓ git checkout -b feature/user-dashboard
✗ git checkout -b feature/user-dashboard-and-sidebar-and-auth
```

### 3️⃣ Commits pequeños y descriptivos
```
✓ git commit -m "feat(users): add user profile page"
✓ git commit -m "fix(auth): handle expired tokens"

✗ git commit -m "updates"
✗ git commit -m "asdsada"
```

### 4️⃣ Antes de hacer Push, actualizar desde main
```bash
git fetch origin
git rebase origin/main
# Si hay conflictos, resolverlos y continuar
git rebase --continue
git push origin feature/mi-feature --force-with-lease
```

### 5️⃣ Código siempre pasa linter antes de Push
```bash
npm run lint
npm run format
npm run test
```

### 6️⃣ No mergear tu propio PR
- Esperar aprobación de al menos 1 compañero
- Si es urgent, informar en el equipo

### 7️⃣ Mantener branch sincronizado
- Actualizar cada mañana antes de trabajar
- Si vemos que hay cambios en main, hacer merge
```bash
git pull origin main
# Resolver conflictos si hay
```

---

## 🗨️ Comunicación en Equipo

### Canales
- **Código/PRs**: GitHub (comentarios, reviews)
- **Decisiones arquitectura**: Documentar en `/docs`
- **Urgencias**: Chat directo (Teams/Discord/Slack)

### Antes de Escribir Código
- Si es feature grande, crear issue primero
- Discutir con el equipo (evitar duplicar trabajo)
- Documentar decisiones de diseño

### Pull Requests
- **Título claro**: `feat: agregar validación de email`
- **Descripción**: Por qué, qué cambios, cómo testear
- **Link a issue**: `Closes #42`
- **Screenshots**: Si es UI, incluir captures

Plantilla sugerida:
```markdown
## Descripción
Breve resumen de qué cambios se hicieron y por qué.

## Tipo de Cambio
- [ ] Bug fix
- [ ] Nueva feature
- [ ] Breaking change
- [ ] Documentación

## Cambios
- Punto 1
- Punto 2

## Cómo Testear
Pasos para verificar que funciona.

## Screenshots (si aplica)
Capturas de UI changes.

## Checklist
- [ ] Código sigue la convención del proyecto
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Sin conflictos con main
```

---

## 🏗️ Estructura de Trabajo Paralelo

### Cómo Dividir Tareas (Evitar Conflictos)

**Mala distribución:**
```
Dev A: Trabajando en src/renderer/components/ ← conflictos
Dev B: Trabajando en src/renderer/components/ ← conflictos
Dev C: Trabajando en src/db/models/          ← ok
```

**Buena distribución:**
```
Dev A: Features de USUARIOS (frontend + backend)
  └─ src/renderer/features/users/
  └─ src/db/models/User.ts
  └─ src/main/services/UserService.ts

Dev B: Features de PRODUCTOS (frontend + backend)
  └─ src/renderer/features/products/
  └─ src/db/models/Product.ts
  └─ src/main/services/ProductService.ts

Dev C: Infraestructura + UI compartida
  └─ src/renderer/components/common/
  └─ src/shared/
  └─ CI/CD, Configuración
```

### Regla de Oro
**Cada developer es dueño de una feature vertical completa** (UI + Backend + DB)
- Menos conflictos de merge
- Responsabilidad clara
- Fácil de testear

---

## 🔍 Checklist Antes de hacer Push

```bash
# 1. Actualizar desde main
git fetch origin
git rebase origin/main

# 2. Linter y format
npm run lint
npm run format

# 3. Tests
npm run test

# 4. Build
npm run build

# 5. Review propio código antes de push
# Lee tu código como si lo escribiera otro

# 6. Push
git push origin feature/mi-feature
```

---

## 🚨 En Caso de Conflictos

1. **No entrar en pánico**
2. Comunicar al equipo inmediatamente
3. Coordinar quién resuelve
4. Actualizar documentación de cambios si es necesario
5. Testear bien después de resolver

---

## 📅 Reuniones Recomendadas

- **Daily standup** (5-10 min): Qué hice, qué voy a hacer, qué me bloquea
- **Code review** (2-3 veces por semana): Revisar PRs juntos
- **Planning** (semanal): Planificar sprints, asignar tareas

---

**Recuerda:** La comunicación clara evita 90% de los conflictos de código.
