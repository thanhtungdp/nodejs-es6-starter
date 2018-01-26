import express from 'express'
import cardMobileController from 'controllers/cardMobileController'
import { resError } from '../utils/res'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ welcome: 'Welcome to payment mobile' })
})

router.post('/', async (req, res) => {
  const data = {
    code: req.body.code,
    serial: req.body.serial,
    cardType: req.body.cardType,
    user: {
      fullname: 'Phan thanhtung',
      email: 'tungptkh@gmail.com'
    }
  }
  try {
    const resData = await cardMobileController.submitCardMobile(data)
    if (resData.error) {
      resError(res, resData.error, { errorCode: resData.errorCode })
    } else {
      res.json({
        success: true,
        data: resData
      })
    }
  } catch (e) {
    resError(res, e.message)
  }
})

export default router
