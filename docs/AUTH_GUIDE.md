# 🔐 Guía: Login & Register para EduPlatform

## ✅ Lo que hemos creado

### 1. **Backend (Electron Main Process)**
- ✓ Modelo User actualizado con **hash de contraseñas** (bcryptjs)
- ✓ Canales IPC: `auth:register`, `auth:login`, `auth:logout`
- ✓ Validaciones de seguridad:
  - Validación de email
  - Contraseña mínimo 6 caracteres
  - Verificación de emails únicos
  - Hash de contraseñas antes de guardar
  - Comparación segura de contraseñas

### 2. **Frontend (React)**
- ✓ Componente `LoginRegister.tsx` con:
  - Formulario de Login
  - Formulario de Registro
  - Sistema de mensajes de error/éxito
  - Dashboard simple después de autenticarse
  - Estilos minimalistas en tonos grises
- ✓ Archivo CSS con diseño responsivo

### 3. **Tipos Compartidos**
- ✓ DTOs para login/register
- ✓ Canales IPC actualizados

---

## 🚀 Instalación de Dependencias

### 1. Instalar bcryptjs en el backend

```bash
cd /workspaces/EduPlataform/packages/main
npm install bcryptjs
npm install -D @types/bcryptjs
```

### 2. Construir el backend

```bash
cd /workspaces/EduPlataform/packages/main
npm run build
```

---

## 📝 Integración en App.tsx

Para usar el componente en tu aplicación, actualiza `App.tsx`:

```tsx
import React, { useState } from 'react'
import { LoginRegister } from '../features/auth/LoginRegister'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <LoginRegister />
  }

  // Tu dashboard principal aquí
  return (
    <div>
      {/* Contenido después de autenticarse */}
    </div>
  )
}

export default App
```

---

## 🎯 Uso del Componente

### Login
1. Usuario ingresa email y contraseña
2. Se valida en el backend
3. Si es correcto, se muestra el dashboard con sus datos
4. Botón para cerrar sesión

### Registro
1. Usuario completa: nombre, email, contraseña (x2), rol
2. Se valida:
   - Email no duplicado
   - Contraseñas coinciden
   - Longitud mínima
   - Email válido
3. Se crea el usuario con contraseña hasheada
4. Redirige a login

### Seguridad Implementada
- ✓ **Hash de contraseñas**: bcryptjs (salt 10)
- ✓ **Validación de email**: Regex básico
- ✓ **Contraseñas no se devuelven**: `select: false` en Mongoose
- ✓ **Mensajes seguros**: No se especifica si el email existe
- ✓ **Validación en frontend y backend**

---

## 📋 Flujo de Autenticación

```
Login Form
    ↓
window.api.invoke('auth:login', {email, password})
    ↓
Backend: Busca usuario por email
    ↓
Compara contraseña con bcrypt
    ↓
Si OK → Devuelve usuario sin password
Si ERROR → Devuelve mensaje genérico
    ↓
Frontend: Muestra dashboard o error
```

---

## 🎨 Estilos Personalizables

Los estilos están en `src/features/auth/auth.css`. Puedes personalizar:

- Colores del gradiente: `.btn-primary` (línea 165)
- Espacios: Modificar `gap`, `padding`
- Fuentes: Cambiar `font-family`
- Colores de tonos grises: Variables en los selectores

---

## ⚠️ Próximos Pasos (Opcionales)

Para producción, considera agregar:

1. **Tokens JWT**: Para mantener sesiones
2. **Refresh tokens**: Para sesiones de larga duración
3. **Rate limiting**: Proteger contra ataques de fuerza bruta
4. **Email verification**: Confirmar email en el registro
5. **Password reset**: Recuperar contraseña olvidada
6. **2FA**: Autenticación de dos factores

---

## 🐛 Debugging

Si algo no funciona:

1. Revisa la consola del navegador (DevTools)
2. Revisa la consola de Electron (Main process)
3. Verifica que MongoDB esté corriendo
4. Asegúrate de que bcryptjs esté instalado

```bash
npm list bcryptjs  # en packages/main
```

---

## 📞 Resumen de Cambios

| Archivo | Cambio |
|---------|--------|
| `packages/main/src/db/models/User.ts` | Agregado: password + bcryptjs |
| `packages/main/src/ipc/userHandlers.ts` | Agregado: auth:login, auth:register |
| `packages/shared/src/ipc/channels.ts` | Agregado: canales de auth |
| `packages/shared/src/types/user.ts` | Agregado: DTOs de auth |
| `packages/frontend/src/features/auth/LoginRegister.tsx` | NUEVO: Componente React |
| `packages/frontend/src/features/auth/auth.css` | NUEVO: Estilos |

