import md5 from 'md5'

export const PORT = 4000

export const MONGODB_OPTIONS = {
  database: 'mongodb://127.0.0.1:27017/vietan_swm_manager'
}
export const IS_SANDBOX = true

export const NGANLUONG = {
  production: {
    cardMobile: 'https://nganluong.vn/nl30/mobile_card.api.post.v2.php'
  },
  sandbox: {
    merchant: {
      merchant_id: '45581',
      merchant_account: 'thanhtung@tungtung.vn',
      merchant_password: md5('45581|4a349e29498e965e3c741a92c50d631c')
    },
    cardMobile:
      'https://sandbox.nganluong.vn:8088/nl30/mobile_card.api.post.v2.php'
  }
}
export const PAYMENT_API = IS_SANDBOX ? NGANLUONG.sandbox : NGANLUONG.production

export const JWT_SECRET = 'JWTSECRET'

export default {
  PORT,
  MONGODB_OPTIONS,
  JWT_SECRET,
  PAYMENT_API
}
