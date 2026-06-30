import mongoose from 'mongoose'

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eduplatform'

    await mongoose.connect(mongoUri)
    console.log('✅ MongoDB conectado')
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error)
    process.exit(1)
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect()
    console.log('✅ MongoDB desconectado')
  } catch (error) {
    console.error('❌ Error desconectando de MongoDB:', error)
  }
}
