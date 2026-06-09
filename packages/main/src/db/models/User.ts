import { Schema, model } from 'mongoose'

interface IUser {
  _id?: string
  name: string
  email: string
  password?: string
  createdAt?: Date
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  createdAt: { type: Date, default: Date.now },
})

export const User = model<IUser>('User', userSchema)
