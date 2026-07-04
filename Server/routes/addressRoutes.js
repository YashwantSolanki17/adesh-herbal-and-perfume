import express from 'express'
import protect from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()
router.use(protect) // every route below requires login

// GET /api/addresses  — all addresses for the logged-in user
router.get('/', async (req, res) => {
  const user = await User.findById(req.userId)
  res.json(user.addresses)
})

// POST /api/addresses  — add a new address
router.post('/', async (req, res) => {
  const { fullName, phone, line1, city, state, pincode } = req.body
  if (!fullName || !phone || !line1 || !city || !state || !pincode) {
    return res.status(400).json({ message: 'Please fill all required address fields' })
  }

  const user = await User.findById(req.userId)
  user.addresses.push(req.body)
  await user.save()
  res.status(201).json(user.addresses)
})

// DELETE /api/addresses/:addressId
router.delete('/:addressId', async (req, res) => {
  const user = await User.findById(req.userId)
  const addr = user.addresses.id(req.params.addressId)
  if (!addr) return res.status(404).json({ message: 'Address not found' })

  addr.deleteOne()
  await user.save()
  res.json(user.addresses)
})

export default router
