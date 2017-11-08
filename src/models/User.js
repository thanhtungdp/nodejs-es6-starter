import mongoose from 'mongoose';

const User = new mongoose.Schema({
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  id: true
})

User.virtual('id').get(function(){
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
User.set('toJSON', {
    virtuals: true
});

User.set('toObject', {
    virtuals: true
});

export default mongoose.model('User', User);
