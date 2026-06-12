import 'dotenv/config'
import { app, BrowserWindow } from 'electron'
import path from 'path'
import { connectDB, disconnectDB } from './db/connection'

// ======================================================
// Electron Main Process — Entry Point
// Inicializa la ventana, conecta MongoDB, registra IPC
// ======================================================

let mainWindow: BrowserWindow | null = null
const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    titleBarStyle: 'default',
    show: false, // Mostrar solo cuando esté lista
  })

  // Cargar la URL del dev server o el build estático
  const url = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../../frontend/dist/index.html')}`

  mainWindow.loadURL(url)

  // Mostrar la ventana cuando esté lista para evitar flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    if (isDev) {
      mainWindow?.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Inicialización de la app
app.on('ready', async () => {
  await connectDB()

  // Registrar IPC handlers
  require('./ipc/userHandlers')

  createWindow()
})

app.on('window-all-closed', async () => {
  await disconnectDB()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
