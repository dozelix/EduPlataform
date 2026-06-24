# Auth Guide — EduPlatform

Referencia rápida del sistema de autenticación. La documentación completa está en [README.md](../README.md#5-sistema-de-autenticación).

---

## Archivos involucrados

| Archivo | Rol |
|---|---|
| `packages/main/src/db/models/User.js` | Esquema Mongoose con hash bcrypt |
| `packages/main/src/ipc/userHandlers.js` | Handlers `auth:register`, `auth:login`, `auth:logout` |
| `packages/main/src/preload.cjs` | Expone `window.api` al renderer |
| `packages/shared/src/ipc/channels.js` | Constantes de todos los canales |
| `packages/frontend/src/components/LoginRegister.jsx` | Componente de formulario |
| `packages/frontend/src/styles/auth.css` | Estilos del formulario |

---

## Canales IPC de autenticación

```js
import { IPC_CHANNELS } from 'packages/shared/src/ipc/channels.js'

// Registro
window.api.invoke('auth:register', {
  name: 'Juan Pérez',
  email: 'juan@ejemplo.com',
  password: 'minimo6',
  confirmPassword: 'minimo6',
  role: 'student'   // 'student' | 'teacher' | 'admin'
})

// Login
window.api.invoke('auth:login', {
  email: 'juan@ejemplo.com',
  password: 'minimo6'
})

// Logout
window.api.invoke('auth:logout')
```

Respuesta exitosa: `{ success: true, data: { _id, name, email, role, createdAt } }`
Respuesta de error: `{ success: false, error: 'mensaje' }`

---

## Integración del componente

```jsx
// app.jsx — modo landing
<LoginRegister
  onSuccess={(user) => {
    setCurrentUser(user)
    setIsAuthenticated(true)
  }}
/>

// app.jsx — modo autenticado (sección usuarios)
<LoginRegister
  onSuccess={(user) => setCurrentUser(user)}
/>
```

El prop `onSuccess` es opcional (`= () => {}`). Si se omite, el componente funciona de forma autónoma mostrando el dashboard del usuario internamente.

---

## Validaciones aplicadas

**Frontend** (antes de invocar IPC):
- Campos requeridos no vacíos
- `password === confirmPassword`

**Backend** (en el handler IPC):
- Formato de email con regex
- Longitud mínima de 6 caracteres
- Email único en la base de datos
- Hash con bcrypt (salt 10) antes de guardar

---

## Próximos pasos (pendientes)

1. Whitelist de canales IPC en `preload.cjs` — ver [SECURITY.md](../SECURITY.md)
2. Implementar `auth:get-current` para persistencia de sesión
3. Excluir `password` de `user:get-all` — `User.find().select('-password').lean()`
4. JWT para sesiones de larga duración
