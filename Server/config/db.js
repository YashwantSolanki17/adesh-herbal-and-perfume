import mongoose from 'mongoose'

export default async function connectDB() {
  try {
    // family: 4 forces IPv4 — on some Windows setups, trying IPv6 first
    // causes the secure handshake with MongoDB Atlas to fail with a
    // generic "SSL alert" error that has nothing to do with your password.
    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    })
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  }
}