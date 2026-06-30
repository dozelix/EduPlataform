# Security Policy — EduPlataform

**Estado**: Beta / En desarrollo. No usar en producción sin completar el checklist de abajo.

## Versiones soportadas

| Versión | Soporte activo |
|---|---|
| 1.0.x (actual) | Sí |
| < 1.0 | No |

---

## Configuración de seguridad de Electron

EduPlataform implementa las recomendaciones de seguridad de la guía oficial de Electron:

| Configuración | Valor | Propósito |
|---|---|---|
| `nodeIntegration` | `false` | El renderer no tiene acceso directo a Node.js |
| `contextIsolation` | `true` | El contexto del renderer está aislado del preload |
| `preload` | `preload.cjs` | Único puente de comunicación autorizado |

El preload expone exclusivamente `window.api.invoke` y `window.api.on` mediante
`contextBridge.exposeInMainWorld`.

---

## Problemas de seguridad conocidos

Identificados en la revisión de QA, pendientes de corrección. Se listan para transparencia
del equipo. Detalle completo en [docs/AUDITORIA.md](docs/AUDITORIA.md).

### CRÍTICO — Sin whitelist de canales IPC

**Archivo:** `packages/main/src/preload.cjs`

`window.api.invoke(channel, ...args)` acepta cualquier string como canal sin validación. Si la
página del renderer fuera comprometida, un script podría invocar handlers IPC arbitrarios
(`inscripcion:crear`, `comentario:crear`, `leccion:completar`…).

**Solución pendiente:**
```js
const ALLOWED = ['auth:login', 'auth:register', 'auth:logout',
                 'curso:listar', 'aprendizaje:listar', 'inscripcion:crear',
                 'leccion:obtener', 'leccion:completar',
                 'comentario:listar', 'comentario:crear']

invoke: (channel, ...args) => {
  if (!ALLOWED.includes(channel)) throw new Error(`Canal no permitido: ${channel}`)
  return ipcRenderer.invoke(channel, ...args)
}
```

### MEDIO — Sin persistencia de sesión

La sesión activa vive únicamente en el estado de React: al recargar el renderer hay que volver a
iniciar sesión. No hay token ni almacenamiento de sesión.

### MEDIO — `connectDB` termina el proceso con `process.exit(1)`

**Archivo:** `packages/main/src/db/connection.js` línea 11

Si MongoDB no está disponible, Electron cierra abruptamente sin mensaje al usuario.

---

## Checklist de seguridad pre-producción

- [ ] Implementar whitelist de canales IPC en `preload.cjs`
- [ ] Validar/sanitizar todo input en los handlers IPC (Main Process)
- [ ] Configurar autenticación de MongoDB con credenciales fuertes
- [ ] Deshabilitar dev tools en builds de producción: `webPreferences: { devTools: false }`
- [ ] Implementar CSP (Content Security Policy) en Electron
- [ ] No cargar contenido remoto no confiable en una ventana con bridge IPC
- [ ] Auditoría de código de seguridad

---

## Hashing de contraseñas

Se usa **bcryptjs** con salt rounds 10 (ver `packages/main/src/db/models/Usuario.js`).
El hash se aplica en un hook `pre('save')` del esquema; la verificación usa
`userSchema.methods.comparePassword`. Longitud mínima de contraseña: 6 caracteres
(validada en el modelo y en `auth:register`).

---

## Reporte de vulnerabilidades

1. **No abras un issue público** — los problemas de seguridad se comunican en privado.
2. Escribe al mantenedor principal: [@dozelix](https://github.com/dozelix) vía GitHub.
3. Incluye: descripción, pasos para reproducir, impacto estimado y, opcionalmente,
   sugerencia de corrección.

Recibirás confirmación en menos de 72 horas.

---

## Buenas prácticas para contribuidores

- Nunca guardes credenciales, tokens o URIs de base de datos en el código. Usa `.env.local`
  (ignorado por git).
- No deshabilites `contextIsolation` ni actives `nodeIntegration` bajo ninguna circunstancia.
- Los canales IPC nuevos deben añadirse a `packages/shared/src/ipc/channels.js` y documentarse
  en este archivo.
- Toda validación de datos debe hacerse en el Main Process, nunca confiar solo en el renderer.
