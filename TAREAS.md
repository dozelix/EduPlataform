# 📋 Tareas Asignadas - EduPlataform

**Estado del Proyecto**: En Desarrollo | **Versión**: 1.0.0-beta

---

## 📊 Resumen de Prioridades

| Prioridad | Cantidad | Estado |
|-----------|----------|--------|
| 🔴 CRÍTICA | 3 | ⚠️ Bloqueante |
| 🟠 ALTA | 5 | ⏳ Pendiente |
| 🟡 MEDIA | 7 | ⏳ Pendiente |
| 🟢 BAJA | 4 | ⏳ Pendiente |

---

## 🔴 CRÍTICA - Requiere Implementación Inmediata

### 1. Panel de Administrador
**Asignado a**: [@Usuario1]  
**Prioridad**: 🔴 CRÍTICA  
**Plazo**: 2025-12-30  
**Estado**: 🔵 No Iniciado

**Descripción**:
Crear panel de administración con:
- Gestión de usuarios (CRUD)
- Visualización de estadísticas globales
- Control de cursos
- Sistema de permisos y roles

**Tareas Secundarias**:
- [ ] Crear componente Admin.jsx
- [ ] Implementar tabla de usuarios con filtros
- [ ] Crear API handlers: admin:get-users, admin:delete-user, admin:update-role
- [ ] Diseñar interfaz con CSS modular
- [ ] Agregar validaciones de permisos en preload.js

**Archivos Afectados**:
- `packages/frontend/src/features/admin/Admin.jsx` (crear)
- `packages/frontend/src/styles/admin.css` (crear)
- `packages/main/src/ipc/adminHandlers.js` (crear)
- `packages/shared/src/constants/channels.js` (actualizar)

---

### 2. Implementar IPC Whitelist (SEGURIDAD)
**Asignado a**: [@Usuario2]  
**Prioridad**: 🔴 CRÍTICA  
**Plazo**: 2025-12-27  
**Estado**: 🔵 No Iniciado

**Descripción**:
Aplicar whitelist de canales IPC para evitar vulnerabilidades. (Ver [SECURITY.md](SECURITY.md))

**Tareas Secundarias**:
- [ ] Definir lista de canales permitidos
- [ ] Actualizar preload.js con validación
- [ ] Implementar validación de origen en mainHandlers
- [ ] Agregar logging de intentos bloqueados
- [ ] Tests de seguridad

**Archivos Afectados**:
- `packages/main/src/preload.js`
- `packages/shared/src/constants/channels.js`
- `packages/main/src/ipc/` (todos los handlers)

---

### 3. Sistema de Roles y Permisos
**Asignado a**: [@Usuario3]  
**Prioridad**: 🔴 CRÍTICA  
**Plazo**: 2025-12-29  
**Estado**: 🔵 No Iniciado

**Descripción**:
Implementar RBAC (Role-Based Access Control):
- Roles: Admin, Profesor, Estudiante
- Permisos por rol
- Validación en backend y frontend

**Tareas Secundarias**:
- [ ] Actualizar modelo User con roles
- [ ] Crear middleware de autenticación
- [ ] Agregar checks de rol en handlers IPC
- [ ] Proteger rutas del frontend
- [ ] Tests de autorización

---

## 🟠 ALTA Prioridad - Próximas 2 semanas

### 4. Módulo de Calificaciones
**Asignado a**: [@Usuario1]  
**Prioridad**: 🟠 ALTA  
**Plazo**: 2025-12-31  
**Estado**: 🔵 No Iniciado

**Descripción**:
Sistema de calificaciones para cursos con:
- Ingreso de notas
- Promedio automático
- Reportes por estudiante

---

### 5. Mejorar CSS - Eliminar Código Muerto
**Asignado a**: [@Usuario2]  
**Prioridad**: 🟠 ALTA  
**Plazo**: 2025-12-28  
**Estado**: 🔵 No Iniciado

**Descripción**:
Refactorizar estilos según [informe QA](informe%20QA.md):
- Eliminar duplicados (.btn en auth.css y app.css)
- Scope de clases (auth-form .btn-primary)
- Usar variables CSS en lugar de colores hardcodeados

---

### 6. Componentes en Construcción - Limpiar
**Asignado a**: [@Usuario3]  
**Prioridad**: 🟠 ALTA  
**Plazo**: 2025-12-27  
**Estado**: 🔵 No Iniciado

**Descripción**:
- Remover DbTester del flujo principal (mover a Configuración)
- Eliminar componentes muertos (TechStack, Checklist del default)
- Fixear montaje de componentes en App.jsx switch

---

### 7. Tests Unitarios - Setup Inicial
**Asignado a**: [@Usuario1]  
**Prioridad**: 🟠 ALTA  
**Plazo**: 2025-12-30  
**Estado**: 🔵 No Iniciado

**Descripción**:
Configurar suite de testing con Vitest:
- Tests para componentes React
- Tests para handlers IPC
- Tests para modelos Mongoose

---

### 8. Documentación de API IPC
**Asignado a**: [@Usuario2]  
**Prioridad**: 🟠 ALTA  
**Plazo**: 2025-12-29  
**Estado**: 🔵 No Iniciado

**Descripción**:
Crear documentación completa de canales IPC:
- Listado de todos los canales
- Parámetros esperados
- Respuestas posibles
- Ejemplos de uso

---

## 🟡 MEDIA Prioridad - Este Mes

### 9. Módulo de Cursos - CRUD Completo
**Asignado a**: [@Usuario3]  
**Prioridad**: 🟡 MEDIA  
**Plazo**: 2026-01-10  
**Estado**: 🔵 No Iniciado

**Descripción**:
Implementar gestión completa de cursos.

---

### 10. Dashboard - Mejorar Visualización
**Asignado a**: [@Usuario1]  
**Prioridad**: 🟡 MEDIA  
**Plazo**: 2026-01-08  
**Estado**: 🔵 No Iniciado

**Descripción**:
Agregar gráficos, filtros, exportación de datos.

---

### 11. Autenticación - Agregar JWT/Sessions
**Asignado a**: [@Usuario2]  
**Prioridad**: 🟡 MEDIA  
**Plazo**: 2026-01-05  
**Estado**: 🔵 No Iniciado

**Descripción**:
Mejorar sistema de sesiones con tokens JWT.

---

### 12. Responsive Design - Mobile
**Asignado a**: [@Usuario3]  
**Prioridad**: 🟡 MEDIA  
**Plazo**: 2026-01-12  
**Estado**: 🔵 No Iniciado

**Descripción**:
Adaptar interfaz para dispositivos móviles.

---

### 13. Dark Mode Toggle
**Asignado a**: [@Usuario1]  
**Prioridad**: 🟡 MEDIA  
**Plazo**: 2026-01-07  
**Estado**: 🔵 No Iniciado

**Descripción**:
Agregar opción de cambiar entre light y dark mode.

---

### 14. Búsqueda Global
**Asignado a**: [@Usuario2]  
**Prioridad**: 🟡 MEDIA  
**Plazo**: 2026-01-06  
**Estado**: 🔵 No Iniciado

**Descripción**:
Sistema de búsqueda que abarca cursos, usuarios, contenido.

---

### 15. Notificaciones Push
**Asignado a**: [@Usuario3]  
**Prioridad**: 🟡 MEDIA  
**Plazo**: 2026-01-09  
**Estado**: 🔵 No Iniciado

**Descripción**:
Sistema de notificaciones in-app y desktop.

---

## 🟢 BAJA Prioridad - Próximos Meses

### 16. Exportar Datos (CSV/PDF)
**Asignado a**: TBD  
**Prioridad**: 🟢 BAJA  
**Plazo**: 2026-02-01  
**Estado**: 🔵 No Iniciado

---

### 17. Integración de Calendario
**Asignado a**: TBD  
**Prioridad**: 🟢 BAJA  
**Plazo**: 2026-02-05  
**Estado**: 🔵 No Iniciado

---

### 18. Sistema de Ayuda (Help)
**Asignado a**: TBD  
**Prioridad**: 🟢 BAJA  
**Plazo**: 2026-02-10  
**Estado**: 🔵 No Iniciado

---

### 19. Temas Personalizables
**Asignado a**: TBD  
**Prioridad**: 🟢 BAJA  
**Plazo**: 2026-02-15  
**Estado**: 🔵 No Iniciado

---

## 📅 Timeline de Entregas

```
Dic 2025
├── 27 (Miércoles) ........... IPC Whitelist + Limpiar componentes
├── 28 (Jueves) ............. CSS Refactor
├── 29 (Viernes) ............ Roles y Permisos
├── 30 (Sábado) ............ Panel Admin + Tests
└── 31 (Domingo) ........... Calificaciones

Ene 2026
├── 05 (Viernes) ........... JWT/Sessions
├── 06 (Sábado) ............ Búsqueda Global
├── 07 (Domingo) ........... Dark Mode
├── 08 (Lunes) ............. Dashboard Mejorado
├── 09 (Martes) ............ Notificaciones
├── 10 (Miércoles) ......... Cursos CRUD
└── 12 (Viernes) ........... Responsive Mobile
```

---

## 👥 Asignaciones por Usuario

### Usuario 1 - Frontend Principal
- Panel de Administrador 🔴
- Módulo de Calificaciones 🟠
- Tests Unitarios 🟠
- Dashboard Mejorado 🟡
- Dark Mode Toggle 🟡

### Usuario 2 - Seguridad & Backend
- IPC Whitelist 🔴
- Limpiar CSS & Componentes 🟠
- Documentación API IPC 🟠
- Autenticación JWT 🟡
- Búsqueda Global 🟡

### Usuario 3 - Integración & UX
- Sistema de Roles y Permisos 🔴
- Módulo de Cursos 🟡
- Responsive Design 🟡
- Notificaciones Push 🟡

---

## 🔄 Workflow de Tareas

1. **Seleccionar una tarea** → Asignarla a una rama
   ```bash
   git checkout -b feature/admin-panel
   ```

2. **Trabajar en la tarea** → Seguir [REGLAS_COLABORACION.md](docs/REGLAS_COLABORACION.md)
   ```bash
   npm run format && npm run lint
   ```

3. **Completar subtareas** → Marcar en checklist
   - [ ] Tarea completada

4. **Hacer PR** → Pedir revisión
   - Título: `feat: admin panel`
   - Description: Incluir link a esta tarea

5. **Mergear a develop** → Marcar como ✅ COMPLETADA

---

## 📊 Estado General

```
COMPLETADAS:  0 / 19  (0%)
EN PROGRESO:  0 / 19  (0%)
PENDIENTES:   19 / 19 (100%)

BLOQUEANTES: 3 (IPC Whitelist, Panel Admin, Roles)
```

---

## 🚀 Cómo Reclamar una Tarea

1. Comenta en esta sección que vas a trabajar en la tarea
2. Crea una rama: `git checkout -b feature/nombre-tarea`
3. Actualiza el estado a "EN PROGRESO" en este documento
4. Cuando termines, crea PR y actualiza a "COMPLETADA"

---

## 📝 Plantilla para Nueva Tarea

```markdown
### N. Nombre de la Tarea
**Asignado a**: [@Usuario]  
**Prioridad**: 🔴/🟠/🟡/🟢  
**Plazo**: YYYY-MM-DD  
**Estado**: 🔵 No Iniciado / 🟡 En Progreso / ✅ Completada

**Descripción**:
Breve explicación de qué se debe hacer.

**Tareas Secundarias**:
- [ ] Subtarea 1
- [ ] Subtarea 2

**Archivos Afectados**:
- Archivo 1
- Archivo 2
```

---

**Última actualización**: 2025-12-23  
**Próxima revisión**: 2025-12-24  
**Responsable de seguimiento**: Team Lead
