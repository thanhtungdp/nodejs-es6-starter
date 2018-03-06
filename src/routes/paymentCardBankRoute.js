import express from 'express'
import cardBankController from 'controllers/card-bank'
import { resError } from '../utils/res'
import { convertAmountToCoin } from 'utils/coin'
import { PARTY_METHOD, PAYMENT_STATUS } from 'constants/payment'
import partyTransactionDao from 'dao/partyTransactionDao'
import authMiddleware from 'middlewares/authMiddleware'
import Errors from 'constants/errors'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ welcome: 'Welcome to payment baml' })
})

router.post('/', authMiddleware, async (req, res) => {
  const { amount, paymentMethod = PARTY_METHOD.VISA } = req.body
  const bankCode =
    paymentMethod === PARTY_METHOD.VISA ? PARTY_METHOD.VISA : req.body.bankCode
  const coinWillReceive = convertAmountToCoin(amount)
  const data = {
    user: {
      fullname: req.user.fullname,
      email: req.user.email,
      phoneMobile: 'no phone'
    },
    amount: amount,
    paymentMethod: paymentMethod,
    bankCode: bankCode,
    name: `Nạp ${coinWillReceive} vàng trên tungtung.vn`,
    description: `Bạn sẽ nhận ${coinWillReceive} vàng`
  }
  try {
    const checkoutInfo = await cardBankController.checkout.submit(data)
    const paymentTransaction = await partyTransactionDao.create({
      method: paymentMethod,
      status: PAYMENT_STATUS.PENDING,
      transactionId: checkoutInfo.token,
      info: {
        token: checkoutInfo.token
      },
      userId: req.user._id,
      amount: amount,
      coinReceive: convertAmountToCoin(amount)
    })
    res.json({
      success: true,
      checkout: checkoutInfo,
      transaction: paymentTransaction
    })
  } catch (e) {
    resError(res, e.message)
  }
})

router.get('/callback/success', async (req, res) => {
  const { token, error_code: errorCode } = req.query
  try {
    const cardInfo = await cardBankController.callback.submit({
      errorCode,
      token
    })
    if (!cardInfo.isSuccess) {
      resError(res, Errors.PAYMENT.CHECKOUT_HAVE_ERROR)
      return
    }
    const transaction = await partyTransactionDao.get({
      info: { token: token },
      status: PAYMENT_STATUS.PENDING
    })
    // transaction not exists or successed
    if (!transaction) {
      resError(res, Errors.PAYMENT.TRANSACTION_NOT_EXISTS_OR_SUCCESSED)
      return
    }
    const newTransaction = await partyTransactionDao.update(
      {
        info: { token: token }
      },
      {
        status: PAYMENT_STATUS.SUCCESSED,
        transactionId: cardInfo.transactionId
      }
    )
    res.json({
      isSuccess: true,
      info: cardInfo,
      transaction: newTransaction
    })
  } catch (e) {
    console.log(e)
    resError(res, e.message)
  }
})

export default router
