import express from 'express'
import cardMobileController from 'controllers/card-mobile'
import partyTransactionDao from 'dao/partyTransactionDao'
import paymentConstant from 'constants/payment'
import { resError } from '../utils/res'
import { convertAmountToCoin } from '../utils/coin'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ welcome: 'Welcome to payment mobile', user: req.user })
})

router.post('/', async (req, res) => {
  const data = {
    code: req.body.code,
    serial: req.body.serial,
    cardType: req.body.cardType,
    user: {
      fullname: req.user.fullname,
      email: req.user.email
    }
  }
  try {
    const cardInfo = await cardMobileController.submit(data)
    if (cardInfo.error) {
      resError(res, cardInfo.error, { errorCode: cardInfo.errorCode })
    } else {
      const paymentTransaction = await partyTransactionDao.create({
        method: paymentConstant.PARTY_METHOD.CARD,
        status: paymentConstant.PAYMENT_STATUS.SUCCESSED,
        transactionId: cardInfo.transactionId,
        userId: req.user._id,
        amount: cardInfo.amount,
        coinReceive: convertAmountToCoin(cardInfo.amount)
      })
      res.json({
        success: true,
        card: cardInfo,
        transaction: paymentTransaction
      })
    }
  } catch (e) {
    resError(res, e.message)
  }
})

export default router
