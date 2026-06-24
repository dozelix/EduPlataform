Informe de Malas Prácticas, Errores de Diseño e Implementación
Proyecto: EduPlatform — Electron + React + MongoDB (IPC como pseudo-backend)

1. Colisión crítica de clases CSS — .btn y .btn-primary doble definidas
Archivos: auth.css:131-165 y app.css:319-347

Ambos archivos definen .btn y .btn-primary con estilos completamente distintos. auth.css los define light-mode (gris oscuro), app.css los define dark-mode (gradiente morado). Como el orden de imports en styles.css es auth.css → app.css, los botones del formulario de login terminan tomando el gradiente morado en vez del gris gris diseñado para auth. El diseño de auth queda roto por sobreescritura.

Solución: Los botones de auth.css deben tener scope propio: .auth-form .btn-primary en lugar de .btn-primary global.

2. Rotura de coherencia visual — auth es light-mode en una app dark-mode
Archivo: auth.css:15


background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
El fondo del login/register es blanco/gris claro. Toda la app usa --color-bg: #0d1117 (casi negro). Al navegar a "Usuarios/Auth" el cambio es un flash visual abrupto que rompe la identidad del diseño. No hay transición ni coherencia de tokens.

Solución: Reemplazar los colores hardcodeados en auth.css por las variables CSS del sistema (--color-bg, --color-surface, --color-border, --color-text).

3. CSS muerto — app.css define un sidebar y layout que nadie usa
Archivo: app.css:6-143

app.css define .app-layout, .sidebar, .sidebar__brand, .sidebar__nav-item, .main-content, etc. El componente Sidebar.jsx usa el prefijo db-sidebar__* (definido en Dashboard.css). Nunca se instancia .app-layout ni .sidebar en ningún JSX. Son ~140 líneas de CSS muerto que crea confusión sobre cuál es el sistema real.

Solución: Eliminar las secciones App.css — Layout raíz y componentes globales (.app-layout, .sidebar*, .main-content) de app.css. El layout real está en Dashboard.css.

4. Inline styles mezclados con clases CSS en Sidebar.jsx
Archivo: Sidebar.jsx:69-95

El indicador de estado DB usa style={{...}} inline para marginBottom, display, gap, background, etc., mientras Dashboard.css ya tiene .sidebar__status y .sidebar__status-dot. Además el componente usa className="sidebar__status" (del sistema viejo de app.css) en vez de db-sidebar__status (el sistema real). Hay tres inconsistencias mezcladas en un solo bloque.

Solución: Reemplazar los inline styles por la clase db-sidebar__status y .db-sidebar__status-dot ya definidas en Dashboard.css. Eliminar el bloque style={{...}}.

5. Error de montaje — DbTester aparece en secciones incorrectas
Archivo: app.jsx:41-59

El switch del renderContent tiene un default que muestra TechStack + StatsGrid + Checklist + DbTester. Esto significa que al navegar a "Cursos", "Calificaciones" o "Configuración", el usuario ve el panel de prueba de conexión DB mezclado con componentes dev. StatsGrid también aparece en default Y en el Dashboard, duplicando el componente.

Solución: El default del switch debería mostrar una pantalla "en construcción" o simplemente retornar null. DbTester debe vivir solo en una sección de "Configuración" o eliminarse del flujo de producción.

6. Seguridad — preload.cjs no tiene whitelist de canales IPC
Archivo: preload.cjs:4-5


invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
Cualquier canal string puede ser invocado desde el renderer. En producción la app carga https://dozelix.github.io/EduPlataform/ — si esa URL fuera comprometida (XSS, supply chain), tendría acceso completo a todos los handlers IPC incluyendo user:get-all, user:delete, user:create. Para una app Electron esto es un vector de ataque conocido.

Solución:


const ALLOWED_CHANNELS = ['auth:login', 'auth:register', 'auth:logout', 'user:get-all', ...]
invoke: (channel, ...args) => {
  if (!ALLOWED_CHANNELS.includes(channel)) throw new Error(`Canal no permitido: ${channel}`)
  return ipcRenderer.invoke(channel, ...args)
}
7. Seguridad — user:get-all retorna contraseñas hasheadas al renderer
Archivo: userHandlers.js:100


const users = await User.find().lean()
User.find() retorna todos los campos incluyendo password (hash bcrypt). Aunque no sea texto plano, exponer hashes al renderer viola el principio de menor privilegio y puede facilitar ataques offline si se intercepta el IPC.

Solución: User.find().select('-password').lean()

8. Seguridad — user:create no valida ni requiere auth
Archivo: userHandlers.js:120-128


ipcMain.handle('user:create', async (_, userData) => {
  const user = new User(userData)
  const saved = await user.save()
  ...
Este handler acepta el objeto sin validar email, sin verificar longitud de contraseña, sin verificar si el email ya existe. Cualquier llamada a window.api.invoke('user:create', {...}) puede crear usuarios con roles arbitrarios incluyendo admin, sin pasar por las validaciones de auth:register. Es un bypass de seguridad total.

Solución: user:create debe usar la misma lógica de validación que auth:register, o simplemente redirigir a él.

9. Estado de autenticación aislado — sesión no es global
Archivos: app.jsx:26 y LoginRegister.jsx:13

El currentUser vive solo dentro de LoginRegister.jsx. App.jsx tiene const MOCK_USER = { name: 'Jean', initials: 'JE' } hardcodeado que nunca se actualiza al hacer login. El Topbar siempre muestra "Jean". El botón "Cerrar sesión" en el Sidebar (Sidebar.jsx:99) no tiene onClick — no hace nada.

Solución: Crear un AuthContext (React Context) que comparta currentUser, login() y logout() entre todos los componentes. El Sidebar y Topbar se suscriben al contexto.

10. Sin persistencia de sesión
Archivo: userHandlers.js:89-92

auth:logout solo retorna { success: true }. No hay token, cookie, ni electron-store. Al recargar el renderer (o al abrir la app de nuevo), el usuario está deslogueado. No existe implementación del canal auth:get-current que sí está definido en channels.js:7.

Solución: Usar electron-store para persistir el userId de la sesión activa. Implementar auth:get-current que retorna el usuario de la sesión guardada.

11. connectDB llama process.exit(1) en fallo de conexión
Archivo: connection.js:9


process.exit(1)
Si MongoDB no está disponible, Electron termina abruptamente sin mostrar ningún mensaje al usuario. En una app desktop esto es inaceptable — el usuario ve la ventana cerrarse sin explicación.

Solución: Retornar el error y mostrarlo como un diálogo de Electron (dialog.showErrorBox) antes de salir, o mejor aún, mostrar una UI de "reconectando..." usando ipcMain.emit('db:status', 'error').

12. Race condition en carga de handlers IPC
Archivo: index.js:45-51


app.on('ready', async () => {
  await connectDB()
  createWindow()            // ← ventana abierta
  await import('./ipc/userHandlers.js')  // ← handlers registrados DESPUÉS
})
createWindow() se llama antes de que los handlers IPC sean registrados. Si el renderer carga muy rápido y envía un IPC antes del await import, no habrá handler que lo reciba. Aunque raro en práctica, es una condición de carrera real.

Solución: Mover await import('./ipc/userHandlers.js') antes de createWindow().

13. IPC_CHANNELS definidos pero nunca usados
Archivo: channels.js

El módulo shared/src/ipc/channels.js define todas las constantes de canales IPC, pero tanto userHandlers.js como LoginRegister.jsx usan strings literales ('auth:login', 'user:get-all'). Si se renombra un canal, hay que buscarlo manualmente en todo el código. El shared package existe para evitar exactamente esto.

Solución: Importar IPC_CHANNELS en ambos lados del IPC y reemplazar todos los strings literales.

14. auth.css redefine el reset global *
Archivo: auth.css:6-8


* {
  box-sizing: border-box;
}
Esta regla ya está en index.css con *, *::before, *::after. La duplicación en auth.css es redundante y aplica globalmente (no está scoped). Si auth.css se refactoriza para ser un módulo CSS en el futuro, esta regla podría romper otros estilos inesperadamente.

Resumen priorizado
#	Severidad	Área	Archivo clave
6	🔴 Crítica	Seguridad IPC	preload.cjs
7	🔴 Crítica	Seguridad datos	userHandlers.js:100
8	🔴 Crítica	Seguridad auth bypass	userHandlers.js:120
11	🟠 Alta	Estabilidad	connection.js:9
9	🟠 Alta	Arquitectura	app.jsx + LoginRegister.jsx
12	🟠 Alta	Race condition	index.js:50
1	🟡 Media	CSS colisión	auth.css + app.css
2	🟡 Media	Diseño visual	auth.css:15
5	🟡 Media	Montaje erróneo	app.jsx:41
10	🟡 Media	UX sesión	userHandlers.js:89
3	🟢 Baja	CSS muerto	app.css:6-143
4	🟢 Baja	CSS inconsistente	Sidebar.jsx:69
13	🟢 Baja	Mantenibilidad	channels.js
Los ítems 6, 7 y 8 son los únicos que requieren atención antes de cualquier uso con datos reales.