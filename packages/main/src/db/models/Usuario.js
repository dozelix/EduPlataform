import { Schema, model } from 'mongoose'
import bcrypt from 'bcryptjs'

// Modelo del Caso 3: colección existente `usuarios` (campos en español).
// Mantiene bcrypt (opción C): los usuarios del seed recibieron contraseña hasheada.
const usuarioSchema = new Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tipo: { type: String, enum: ['estudiante', 'instructor'], default: 'estudiante' },
    password: { type: String, minlength: 6, select: false },
  },
  { collection: 'usuarios' }
)

// Hashea la contraseña antes de guardar solo si cambió (registro de usuarios nuevos).
// Los usuarios del seed ya se insertan con el hash, sin pasar por este hook.
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

usuarioSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

export const Usuario = model('Usuario', usuarioSchema)
