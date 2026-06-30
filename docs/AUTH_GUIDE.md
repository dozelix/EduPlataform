# Auth Guide — EduPlataform (Caso 3)

Referencia del sistema de autenticación. La autenticación va contra la colección **`usuarios`**
del seed del Caso 3 (campos en español), con bcrypt.

---

## Archivos involucrados

| Archivo | Rol |
|---|---|
| `packages/main/src/db/models/Usuario.js` | Esquema de `usuarios` (nombre, email, tipo, password bcrypt) |
| `packages/main/src/ipc/authHandlers.js` | Handlers `auth:login`, `auth:register`, `auth:logout` |
| `packages/main/src/preload.cjs` | Expone `window.api` al renderer |
| `packages/shared/src/ipc/channels.js` | Constantes de canales |
| `packages/frontend/src/components/LoginRegister.jsx` | Vista 1 (formulario, diseño Udemy) |

---

## Canales IPC

```js
// Login
window.api.invoke('auth:login', { email: 'estudiante1@edu.cl', password: 'edu12345' })

// Registro (tipo: 'estudiante' | 'instructor')
window.api.invoke('auth:register', {
  nombre: 'Nuevo Usuario',
  email: 'nuevo@edu.cl',
  password: 'min6chars',
  confirmPassword: 'min6chars',
  tipo: 'estudiante',
})

// Logout
window.api.invoke('auth:logout')
```

Respuesta exitosa: `{ success: true, data: { id, nombre, email, tipo } }`
Respuesta de error: `{ success: false, error: 'mensaje' }`

---

## Credenciales de prueba (seed)

| Email | Tipo | Contraseña |
|---|---|---|
| `estudiante1@edu.cl` | estudiante | `edu12345` |
| `instructor1@edu.cl` | instructor | `edu12345` |
| `deleted@edu.cl` | estudiante | `edu12345` |

Los usuarios del seed venían **sin contraseña**; se les agregó una contraseña de desarrollo
(bcrypt) para poder iniciar sesión (opción del caso resuelta en `seeds/eduplatform.seed.js`).

---

## Validaciones

**Frontend** (`LoginRegister.jsx`): campos requeridos, `password === confirmPassword`.
**Backend** (`authHandlers.js`): formato de email, mínimo 6 caracteres, email único, hash bcrypt
(salt 10). El login solo funciona en la ventana de Electron (ahí existe `window.api`).
