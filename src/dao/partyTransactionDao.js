import PartyTransaction from 'models/PartyTransaction.js'
import User from 'models/User'
import { PAYMENT_STATUS } from 'constants/payment'

export default {
  getTotal (query = {}) {
    return PartyTransaction.find(query).count()
  },

  /**
   * Update coin to user
   * @param coinType
   * @param coinReceive
   * @param userId
   * @returns {Promise<void>}
   */
  async triggerToUser ({ coinType, coinReceive, userId }) {
    const user = await User.findOne({ _id: userId })
    if (user) {
      if (user.coin) {
        // Update coin exists ted
        if (user.coin[coinType]) {
          user.coin[coinType] = user.coin[coinType] + coinReceive
        } else {
          user.coin[coinType] = coinReceive
        }
      } else {
        // Create new coin object
        user.coin = {
          [coinType]: coinReceive
        }
      }
      await user.save()
    }
  },

  async create (data = {}) {
    let partyTransaction = new PartyTransaction(data)
    await partyTransaction.save()
    if (partyTransaction.status === PAYMENT_STATUS.SUCCESSED) {
      this.triggerToUser(partyTransaction)
    }
    return partyTransaction
  },

  getAll (query = {}, { minIndex, itemPerPage }) {
    return PartyTransaction.find(query)
      .skip(minIndex)
      .limit(itemPerPage)
  },

  async get (query) {
    let tag = await PartyTransaction.findOne(query)
    return tag
  },

  async update (query, data) {
    const transaction = await PartyTransaction.findOne(query)
    const transactionAfterSaved = await PartyTransaction.findOneAndUpdate(
      query,
      data,
      { new: true }
    )
    if (
      transaction.status === PAYMENT_STATUS.PENDING &&
      transactionAfterSaved.status === PAYMENT_STATUS.SUCCESSED
    ) {
      this.triggerToUser(transactionAfterSaved)
    }

    return transactionAfterSaved
  },

  async delete (query) {
    let status = await PartyTransaction.deleteOne(query)
    return status
  }
}
