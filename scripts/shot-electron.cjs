// Arnes de verificacion visual del app Electron (dev-only). Lanza la app real con
// Playwright, recorre el flujo de inscripcion sin sesion del issue #21 y guarda una
// captura por paso para revisarlas. No reemplaza a los tests: es "ver" la GUI real.
//
// Requisitos: Vite dev en localhost:5173 (npm run dev:frontend) y MongoDB corriendo.
// Uso:  SHOT_DIR=<carpeta> node scripts/shot-electron.cjs
//       (Electron carga localhost:5173 solo con NODE_ENV=development.)

const path = require('path');
const fs = require('fs');
const { _electron: electron } = require('playwright-core');

const OUT = process.env.SHOT_DIR || path.join(require('os').tmpdir(), 'eduplatform-shots');
const MAIN = path.join(__dirname, '..', 'packages', 'main', 'src', 'index.js');
const CREDS = { email: 'estudiante1@edu.cl', password: 'edu12345' };

// Captura la ventana con un nombre de paso y lo deja registrado en consola.
async function shot(page, nombre) {
  fs.mkdirSync(OUT, { recursive: true });
  const file = path.join(OUT, nombre + '.png');
  await page.screenshot({ path: file, fullPage: false });
  console.log('  shot -> ' + file);
}

async function main() {
  const app = await electron.launch({
    executablePath: require('electron'),
    args: [MAIN],
    env: { ...process.env, NODE_ENV: 'development' },
  });

  // Diagnostico: volcar la salida del proceso main y los errores del renderer.
  app.process().stdout.on('data', (d) => console.log('[main] ' + d.toString().trim()));
  app.process().stderr.on('data', (d) => console.log('[main:err] ' + d.toString().trim()));

  const page = await app.firstWindow();
  page.on('pageerror', (err) => console.log('[pageerror] ' + err.message));
  page.on('console', (m) => console.log('[console] ' + m.text()));
  await page.waitForLoadState('domcontentloaded');
  console.log('  url: ' + page.url());
  await shot(page, '0-carga-inicial');
  // El devtools abierto en dev encoge el area util; se cierra para capturar limpio.
  await app.evaluate(({ BrowserWindow }) => {
    const w = BrowserWindow.getAllWindows()[0];
    if (w) w.webContents.closeDevTools();
  });

  // 1. Catalogo publico (sin sesion): deben verse las tarjetas y "Inscribirse".
  await page.waitForSelector('.cat-card__enroll', { timeout: 25000 });
  await shot(page, '1-catalogo-publico');

  // 2. Inscribirse sin sesion -> debe abrir el login.
  await page.locator('.cat-card__enroll').first().click();
  await page.waitForSelector('#login-email', { timeout: 10000 });
  await shot(page, '2-login-tras-inscribir');

  // 3. Iniciar sesion -> bienvenida -> aterrizar en Mi Aprendizaje.
  await page.fill('#login-email', CREDS.email);
  await page.fill('#login-password', CREDS.password);
  await page.click('button[type="submit"]');
  await page.waitForSelector('text=Mi Aprendizaje', { timeout: 15000 });
  await shot(page, '3-mi-aprendizaje');

  console.log('OK: flujo #21 recorrido, capturas en ' + OUT);
  await app.close();
}

main().catch(async (e) => {
  console.error('ERROR:', e.message);
  process.exit(1);
});
