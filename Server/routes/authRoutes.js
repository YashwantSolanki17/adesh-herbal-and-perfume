import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'
import protect from '../middleware/auth.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const exists = await User.findOne({ email: email.toLowerCase() })
    if (exists) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: (email || '').toLowerCase() })

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET /api/auth/me  (used on page load to check "am I still logged in?")
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.userId).select('-password -addresses')
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
})

export default router
