var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
  coin: {
    gold: { type: Number, default: 0 },
    diamond: { type: Number, default: 0 }
  }
})

UserSchema.virtual('id').get(function () {
  return this._id
})

UserSchema.set('toJSON', { virtuals: true })

export default mongoose.model('user', UserSchema)
