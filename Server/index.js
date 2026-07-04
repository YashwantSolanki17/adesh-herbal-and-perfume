import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import addressRoutes from './routes/addressRoutes.js'
import orderRoutes from './routes/orderRoutes.js'

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/addresses', addressRoutes)
app.use('/api/orders', orderRoutes)

app.get('/', (req, res) => res.send('Aadesh Herbal & Perfume API is running 🌿'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`))
