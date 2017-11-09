import mongoose from 'mongoose'

const User = new mongoose.Schema(
  {
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
)

export default mongoose.model('User', User)
