import mongoose from 'mongoose'

const User = new mongoose.Schema({
  email: String,
  role: { type: String, default: 'user' },
  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', User)
