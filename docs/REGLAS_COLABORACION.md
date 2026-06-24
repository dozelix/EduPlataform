# Reglas de Colaboración — EduPlatform

<<<<<<< HEAD

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
=======
Referencia rápida del workflow del equipo. La documentación completa está en [README.md](../README.md#9-flujo-de-trabajo-del-equipo).
>>>>>>> 2ccd77a0d0270e543d8a916fd4d713d0ee4a6a7e

---

## Equipo y responsabilidades

| Usuario | Área | Labels de auto-asignación |
|---|---|---|
| [@dozelix](https://github.com/dozelix) | Lead, arquitectura, QA | `complex` `design-bug` `qa` `docs-obsolete` |
| [@EchoBit3](https://github.com/EchoBit3) | Frontend, componentes UI | `ui-complement` |
| [@N4C4](https://github.com/N4C4) | Auth, backend, IPC | `auth` |

---

## Flujo de trabajo (resumen)

```bash
# Crear rama desde main actualizado
git checkout main && git pull origin main
git checkout -b feature/nombre

# Trabajo + commits semánticos
git commit -m "feat(scope): descripción"

# Integrar main antes de abrir PR
git fetch origin && git rebase origin/main

# Push y PR (requiere 1 aprobación + CI verde)
git push origin feature/nombre
```

Regla de oro: **nunca commits directos a `main`**.

---

## Tipos de commit

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `style` | CSS o formateo puro |
| `refactor` | Mejora sin cambio de comportamiento |
| `docs` | Documentación |
| `chore` | Dependencias, CI, configuración |
| `test` | Tests |

---

## Issues y labels

Abrir issues desde las plantillas de GitHub:

- **Design / QA Report** → errores visuales, de montaje o comportamiento
- **Docs Review** → documentación desactualizada

La label determina el asignado automático (via `auto-assign.yml`).

---

## CI automático en PRs

Al abrir un PR contra `main` corre automáticamente:

1. `npm run lint` — calidad de código
2. `npm test -- --run` — suite de tests
3. `npm run build:frontend` — verificación de compilación
4. Reporte de docs sin actualizar en más de 90 días

---

## Checklist antes del push

```bash
npm run format && npm run lint && npm test -- --run
```
