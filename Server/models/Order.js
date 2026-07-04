import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    items: [
      {
        productId: Number,
        name:      String,
        emoji:     String,
        price:     Number,
        quantity:  Number,
      },
    ],

    address: {
      fullName: String,
      phone:    String,
      line1:    String,
      line2:    String,
      city:     String,
      state:    String,
      pincode:  String,
    },

    // 'online' = Card/UPI/Wallets via Razorpay, 'cod' = Cash on Delivery
    paymentMethod: { type: String, enum: ['online', 'cod'], required: true },

    totalAmount: { type: Number, required: true }, // includes delivery + COD charge if any

    razorpayOrderId:   String,
    razorpayPaymentId: String,

    // pending -> paid (online success) | placed (COD, nothing to verify) | failed
    status: {
      type: String,
      enum: ['pending', 'paid', 'placed', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
