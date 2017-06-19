import mongoose from 'mongoose';

const User = new mongoose.Schema({
  username: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})
