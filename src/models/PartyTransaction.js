import mongoose from 'mongoose'
import { COIN_TYPE, PARTY_SERVICE } from 'constants/payment'

const PartyTransaction = new mongoose.Schema({
  transactionId: String,
  info: { type: Object },
  method: String,
  status: String,
  userId: { type: mongoose.Schema.ObjectId, ref: 'user' },
  amount: Number,
  coinReceive: Number,
  coinType: { type: String, default: COIN_TYPE.GOLD },
  partyService: { type: String, default: PARTY_SERVICE.NGANLUONG },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.model('party_transactions', PartyTransaction)
