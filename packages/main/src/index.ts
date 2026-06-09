import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { connectDB, disconnectDB } from './db/connection'

let mainWindow: BrowserWindow | null = null
const isDev = process.env.NODE_ENV === 'development'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  const url = isDev
    ? 'http://localhost:5173'
    : `file://${path.join(__dirname, '../../renderer/dist/index.html')}`

  mainWindow.loadURL(url)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', async () => {
  await connectDB()
  createWindow()
  require('./ipc/userHandlers')
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
