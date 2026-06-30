import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB, disconnectDB } from './db/connection.js'
import * as dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load environment variables from workspace root
dotenv.config({ path: path.join(__dirname, '../../../.env.local') })
dotenv.config({ path: path.join(__dirname, '../../../.env') })

let mainWindow = null
const isDev = process.env.NODE_ENV !== 'production'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'), // 👈 Inyecta el puente IPC seguro window.api
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  // 🌐 EL TRUCO MAGISTRAL:
  // Si estamos en desarrollo, consume el servidor local caliente de Vite (localhost:5173).
  // Si estamos en producción, descarga el bundle web directamente desde GitHub Pages.
  const url = isDev
    ? 'http://localhost:5173'
    : 'https://dozelix.github.io/EduPlataform/' // 👈 REEMPLAZA CON TU ENLACE DE GH-PAGES

  mainWindow.loadURL(url)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', async () => {
  await connectDB() // Conexión a MongoDB Local nativa
  createWindow()

  // Carga dinámica de handlers IPC nativos
  await import('./ipc/authHandlers.js')
  await import('./ipc/courseHandlers.js')
  await import('./ipc/learningHandlers.js')
  await import('./ipc/lessonHandlers.js')
})

app.on('window-all-closed', async () => {
  await disconnectDB()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})