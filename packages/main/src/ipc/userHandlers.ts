import { ipcMain } from 'electron'
import { User } from '../db/models/User'

ipcMain.handle('user:get-all', async () => {
  return await User.find()
})

ipcMain.handle('user:get-by-id', async (_, id: string) => {
  return await User.findById(id)
})

ipcMain.handle('user:create', async (_, userData: any) => {
  const user = new User(userData)
  return await user.save()
})

ipcMain.handle('user:update', async (_, id: string, userData: any) => {
  return await User.findByIdAndUpdate(id, userData, { new: true })
})

ipcMain.handle('user:delete', async (_, id: string) => {
  return await User.findByIdAndDelete(id)
})
