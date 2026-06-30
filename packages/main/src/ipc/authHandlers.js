import { ipcMain } from 'electron'
import { Usuario } from '../db/models/Usuario.js'

// ======================================================
// IPC Auth Handlers (Caso 3)
// Autentica contra la colección `usuarios` (estudiantes e instructores).
// Mantiene bcrypt; devuelve el usuario con vocabulario del caso: nombre, tipo.
// Canales: auth:login, auth:register, auth:logout
// ======================================================

function publico(usuario) {
  return {
    id: usuario._id.toString(),
    nombre: usuario.nombre,
    email: usuario.email,
    tipo: usuario.tipo,
  }
}

ipcMain.handle('auth:login', async (_, { email, password } = {}) => {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email y contraseña requeridos' }
    }
    const usuario = await Usuario.findOne({ email: email.toLowerCase() }).select('+password')
    if (!usuario || !usuario.password) {
      return { success: false, error: 'Email o contraseña incorrectos' }
    }
    const valido = await usuario.comparePassword(password)
    if (!valido) {
      return { success: false, error: 'Email o contraseña incorrectos' }
    }
    return { success: true, data: publico(usuario) }
  } catch (error) {
    return { success: false, error: error.message || 'Error en el login' }
  }
})

ipcMain.handle('auth:register', async (_, data = {}) => {
  try {
    const { nombre, email, password, confirmPassword, tipo = 'estudiante' } = data

    if (!nombre || !email || !password) {
      return { success: false, error: 'Todos los campos son requeridos' }
    }
    if (password !== confirmPassword) {
      return { success: false, error: 'Las contraseñas no coinciden' }
    }
    if (password.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' }
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Email inválido' }
    }

    const existe = await Usuario.findOne({ email: email.toLowerCase() })
    if (existe) {
      return { success: false, error: 'El email ya está registrado' }
    }

    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      password,
      tipo: tipo === 'instructor' ? 'instructor' : 'estudiante',
    })

    return { success: true, data: publico(usuario) }
  } catch (error) {
    return { success: false, error: error.message || 'Error en el registro' }
  }
})

ipcMain.handle('auth:logout', async () => {
  return { success: true, data: { message: 'Sesión cerrada' } }
})
