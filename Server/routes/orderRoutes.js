import express from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import protect from '../middleware/auth.js'
import Order from '../models/Order.js'

const router = express.Router()
router.use(protect)

// Razorpay is created lazily (only when an online payment actually happens),
// not when the server starts. This means your server can run fine — and you
// can test login/address/cart — even before Razorpay keys are ready.
// COD orders never touch this at all.
let razorpay = null
function getRazorpay() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are not set in .env yet. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET, or use Cash on Delivery for now.')
  }
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  return razorpay
}

// POST /api/orders/create
// Creates the Order record. If paymentMethod is 'online', also creates
// a matching Razorpay order for the frontend to open in its checkout popup.
// If 'cod', the order is placed immediately — no gateway involved.
router.post('/create', async (req, res) => {
  try {
    const { items, address, totalAmount, paymentMethod } = req.body

    if (!items?.length || !address || !totalAmount || !paymentMethod) {
      return res.status(400).json({ message: 'Missing order details' })
    }
    if (!['online', 'cod'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' })
    }

    // ── Cash on Delivery: place order directly ──
    if (paymentMethod === 'cod') {
      const order = await Order.create({
        user: req.userId,
        items,
        address,
        totalAmount,
        paymentMethod: 'cod',
        status: 'placed',
      })
      return res.status(201).json({ orderId: order._id, status: 'placed' })
    }

    // ── Online: create a Razorpay order, frontend opens its checkout with this ──
    const razorpayOrder = await getRazorpay().orders.create({
      amount: Math.round(totalAmount * 100), // Razorpay expects paise, not rupees
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    })

    const order = await Order.create({
      user: req.userId,
      items,
      address,
      totalAmount,
      paymentMethod: 'online',
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
    })

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// POST /api/orders/verify
// Called after Razorpay's checkout popup succeeds. Verifies the payment
// signature server-side (never trust the frontend alone for this).
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      await Order.findByIdAndUpdate(orderId, { status: 'failed' })
      return res.status(400).json({ message: 'Payment verification failed' })
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status: 'paid', razorpayPaymentId: razorpay_payment_id },
      { new: true }
    )

    res.json({ message: 'Payment verified', order })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// GET /api/orders  — order history for the logged-in user
router.get('/', async (req, res) => {
  const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 })
  res.json(orders)
})

export default router