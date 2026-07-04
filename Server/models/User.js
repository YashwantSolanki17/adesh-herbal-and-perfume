import mongoose from 'mongoose'

// Addresses are stored INSIDE the user document — each user
// can have multiple saved addresses (Home, Office, etc.)
const addressSchema = new mongoose.Schema({
  label:    { type: String, default: 'Home' },
  fullName: { type: String, required: true },
  phone:    { type: String, required: true },
  line1:    { type: String, required: true },
  line2:    { type: String },
  city:     { type: String, required: true },
  state:    { type: String, required: true },
  pincode:  { type: String, required: true },
})

const userSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true }, // stored as a bcrypt hash, never plain text
    addresses: [addressSchema],
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)
