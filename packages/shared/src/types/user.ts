// ======================================================
// SHARED TYPES — User
// Interfaz compartida entre main (Mongoose) y frontend (React)
// ======================================================

export interface IUser {
  _id?: string
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student'
  createdAt?: Date
  updatedAt?: Date
}

export type CreateUserDTO = Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>
export type UpdateUserDTO = Partial<CreateUserDTO>
