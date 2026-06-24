<<<<<<< HEAD
# 🔐 Política de Seguridad - EduPlataform

**Estado**: 🔴 En Desarrollo - No usar en Producción

> Esta aplicación está en fase de desarrollo. No se debe utilizar en entornos de producción sin implementar las medidas de seguridad descritas en este documento.

---

## ⚠️ Vulnerabilidades Críticas Conocidas

### 1. **IPC Sin Whitelist** (CRÍTICA)

**Ubicación**: `packages/main/src/preload.js`

**Riesgo**: Cualquier canal IPC puede ser invocado desde el renderer, incluyendo:
- `user:get-all` (acceso a todos los usuarios)
- `user:delete` (eliminar usuarios)
- `user:create` (crear usuarios)
- `user:update` (modificar datos)

**Impacto**: Si la URL de producción (`https://dozelix.github.io/EduPlataform/`) sufre XSS o compromiso de supply chain, un atacante tiene acceso completo a todas las operaciones de BD.

**Estado**: ❌ NO IMPLEMENTADO

**Solución Requerida**:
```javascript
// preload.js - Implementar whitelist
const ALLOWED_CHANNELS = {
  'user:get-all': true,
  'user:create': true,
  'user:login': true,
};

contextBridge.exposeInMainWorld('api', {
  invoke: (channel, ...args) => {
    if (!ALLOWED_CHANNELS[channel]) {
      throw new Error(`Canal IPC no permitido: ${channel}`);
    }
    return ipcRenderer.invoke(channel, ...args);
  },
});
```

---

### 2. **Variables de Entorno Expuestas**

**Riesgo**: Credenciales de MongoDB pueden quedar en:
- `.env` commiteado en Git
- Build bundles de React
- Electron dev tools

**Solución**:
- ✅ Agregar `.env` a `.gitignore`
- ✅ Usar `VITE_` prefix solo para variables públicas
- ✅ Cargar credenciales solo en main process
- ✅ Deshabilitar dev tools en producción

---

### 3. **MongoDB Sin Autenticación**

**Riesgo**: Conexión local a MongoDB sin usuario/contraseña

**Solución Requerida** (producción):
```env
MONGO_URI=mongodb://username:password@host:27017/eduplatform?authSource=admin
```

---

## 📋 Versiones Soportadas

| Versión | Status | Soporte de Seguridad | Notas |
|---------|--------|----------------------|-------|
| 1.0.0+ | 🟡 Beta | En curso | Desarrollo activo, vulnerabilidades conocidas |
| < 1.0.0 | 🔴 No soportado | Finalizado | No usar |

---

## 🛡️ Checklist de Seguridad Pre-Producción

**Antes de desplegar a producción, completar:**

- [ ] Implementar whitelist de canales IPC
- [ ] Configurar autenticación MongoDB con credenciales fuertes
- [ ] Deshabilitar dev tools: `webPreferences: { devTools: false }`
- [ ] Implementar CSP (Content Security Policy) en Electron
- [ ] Validar y sanitizar TODOS los inputs de usuario
- [ ] Usar HTTPS para cualquier comunicación remota
- [ ] Implementar rate limiting en handlers IPC
- [ ] Auditoría de código de seguridad
- [ ] Tests de penetración
- [ ] Setup de CORS restrictivo si hay API remota

---

## 🔍 Validación de Entradas

**OBLIGATORIO en todos los handlers IPC**:

```javascript
// Ejemplo - userHandlers.js
ipcMain.handle('user:create', async (event, userData) => {
  // Validar
  if (!userData.email || !isValidEmail(userData.email)) {
    throw new Error('Email inválido');
  }
  if (!userData.password || userData.password.length < 8) {
    throw new Error('Password debe tener mínimo 8 caracteres');
  }
  
  // Sanitizar
  const sanitized = {
    email: userData.email.toLowerCase().trim(),
    name: userData.name.trim(),
    password: userData.password, // Hash con bcrypt antes de guardar!
  };
  
  return await User.create(sanitized);
});
```

---

## 🔐 Hashing de Passwords

**NO**: Guardar passwords en plain text

**SÍ**: Usar bcrypt con salt rounds mínimo 10

```javascript
const bcrypt = require('bcrypt');

// Al crear usuario
const hashedPassword = await bcrypt.hash(password, 10);
await User.create({ email, password: hashedPassword });

// Al validar
const isValid = await bcrypt.compare(inputPassword, storedHash);
```

---

## 📡 Comunicación IPC Segura

**Principios**:
1. Whitelist de canales (ver arriba)
2. Validar evento.sender está en whitelist de URLs
3. Nunca confiar en datos del renderer
4. Rate limiting por channel
5. Logging de intentos sospechosos

```javascript
const allowedOrigins = [
  'file://localhost', // Electron dev
  'http://localhost:5173', // Vite dev
];

ipcMain.handle('user:get-all', async (event) => {
  if (!allowedOrigins.includes(event.senderFrame.origin)) {
    throw new Error('Origen no permitido');
  }
  return await User.find();
});
```

---

## 🧪 Testing de Seguridad

**Implementar tests para**:
- ✅ Rechazar canales IPC no whitelisteados
- ✅ Validar inputs maliciosos
- ✅ Rate limiting funciona
- ✅ Passwords se hashean
- ✅ Tokens JWT (si se implementan) validan

---

## 📨 Reporte de Vulnerabilidades

**No reportar vulnerabilidades en issues públicas.**

Para reportar vulnerabilidades:

1. **Email**: Enviar detalles a [@dozelix](https://github.com/dozelix) vía GitHub
2. **Información a incluir**:
   - Descripción del vulnerability
   - Pasos para reproducir
   - Impacto potencial
   - Versión de la app
3. **Expectativa de respuesta**: 7 días máximo
4. **Disclosure responsable**: Esperar parche antes de publicar

---

## 🚨 Incidentes de Seguridad Reportados

| Fecha | Tipo | Estado | Descripción |
|-------|------|--------|-------------|
| 2024-12-23 | IPC Whitelist | Abierto | Implementar validación de canales |
| 2024-12-23 | CSS Colisiones | Abierto | Ver informe QA |
| 2024-12-23 | Componentes Muertos | Abierto | Limpiar CSS no usado |

---

## 📖 Referencias de Seguridad

- [Electron Security](https://www.electronjs.org/docs/tutorial/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Authentication](https://docs.mongodb.com/manual/core/authentication/)

---

## ✅ Cambios Implementados

- [x] Documentación de vulnerabilidades críticas
- [x] Checklist pre-producción
- [x] Ejemplo de implementación segura IPC
- [ ] Implementación real en código
- [ ] Auditoría de seguridad completa

---

**Última actualización**: 2025-12-23  
**Responsable**: EduPlataform Team  
**Próxima revisión**: 2025-01-23
=======
# Security Policy — EduPlatform

## Versiones soportadas

| Versión | Soporte activo |
|---|---|
| 1.0.x (actual) | Sí |
| < 1.0 | No |

---

## Configuración de seguridad de Electron

EduPlatform implementa las recomendaciones de seguridad de la guía oficial de Electron:

| Configuración | Valor | Propósito |
|---|---|---|
| `nodeIntegration` | `false` | El renderer no tiene acceso directo a Node.js |
| `contextIsolation` | `true` | El contexto del renderer está aislado del preload |
| `preload` | `preload.cjs` | Único puente de comunicación autorizado |

El preload expone exclusivamente `window.api.invoke` y `window.api.on` mediante `contextBridge.exposeInMainWorld`.

---

## Problemas de seguridad conocidos

Los siguientes problemas fueron identificados en la revisión de QA y están pendientes de corrección. Se listan aquí para transparencia del equipo.

### CRÍTICO — Sin whitelist de canales IPC

**Archivo:** `packages/main/src/preload.cjs`

El método `window.api.invoke(channel, ...args)` acepta cualquier string como canal sin validación. En modo producción la app carga desde GitHub Pages; si esa URL fuera comprometida, un script malicioso podría invocar handlers IPC arbitrarios.

**Solución pendiente:**
```js
const ALLOWED = ['auth:login', 'auth:register', 'auth:logout',
                 'user:get-all', 'user:get-by-id', 'user:create',
                 'user:update', 'user:delete']

invoke: (channel, ...args) => {
  if (!ALLOWED.includes(channel)) throw new Error(`Canal no permitido: ${channel}`)
  return ipcRenderer.invoke(channel, ...args)
}
```

### ALTO — `user:get-all` devuelve hashes de contraseña

**Archivo:** `packages/main/src/ipc/userHandlers.js` línea 100

`User.find().lean()` no excluye el campo `password`. Aunque el hash no es texto plano, viola el principio de mínimo privilegio.

**Solución pendiente:** Cambiar a `User.find().select('-password').lean()`

### ALTO — `user:create` omite validaciones de autenticación

**Archivo:** `packages/main/src/ipc/userHandlers.js` línea 120

El handler `user:create` acepta `userData` sin validar email, longitud de contraseña ni rol. Permite crear usuarios `admin` sin pasar por el flujo de `auth:register`.

### MEDIO — Sin persistencia de sesión

La sesión activa vive únicamente en el estado React. Al cerrar y reabrir la app, el usuario debe autenticarse de nuevo. El canal `auth:get-current` está definido en `shared/src/ipc/channels.js` pero sin implementación en el backend.

### MEDIO — `connectDB` termina el proceso con `process.exit(1)`

Si MongoDB no está disponible, Electron cierra abruptamente sin mostrar mensaje al usuario.

---

## Reporte de vulnerabilidades

Si descubres una vulnerabilidad de seguridad en este proyecto:

1. **No abras un issue público** — los issues de seguridad deben comunicarse de forma privada.
2. Escribe directamente al mantenedor principal: [@dozelix](https://github.com/dozelix) vía GitHub.
3. Incluye en tu reporte:
   - Descripción del problema
   - Pasos para reproducirlo
   - Impacto estimado
   - Sugerencia de corrección (opcional)

Recibirás confirmación en menos de 72 horas. Una vez corregido el problema, se añadirá una mención en el changelog al contribuyente que lo reportó.

---

## Buenas prácticas para contribuidores

- Nunca guardes credenciales, tokens o URIs de base de datos en el código. Usa `.env.local` (ignorado por git).
- No deshabilites `contextIsolation` ni actives `nodeIntegration` bajo ninguna circunstancia.
- Los canales IPC nuevos deben añadirse a `packages/shared/src/ipc/channels.js` y documentarse en este archivo.
- Toda validación de datos debe hacerse en el Main Process (backend), nunca confiar solo en validación del renderer.
>>>>>>> 2ccd77a0d0270e543d8a916fd4d713d0ee4a6a7e
