import md5 from 'md5'

export const PORT = 4000
export const AUTH_API = 'https://auth-api.tungtung.vn'

export const MONGODB_OPTIONS = {
  database: 'mongodb://171.244.9.42:27017/tungtung',
  dbOptions: {
    native_parser: true,
    poolSize: 5,
    user: 'tungtung',
    pass: 'admintungtung',
    useMongoClient: true,
    promiseLibrary: global.Promise
  }
}
export const PUBLIC_URL = 'http://localhost:4000'
export const IS_SANDBOX = true

export const NGANLUONG = {
  production: {
    merchant: {
      merchantId: '45581',
      merchantAccount: 'thanhtung@tungtung.vn',
      merchantPassword: md5('45581|4a349e29498e965e3c741a92c50d631c')
    },
    cardMobile: 'https://nganluong.vn/mobile_card.api.post.v2.php',
    cardBank: 'https://nganluong.vn/checkout.api.nganluong.post.php'
  },
  sandbox: {
    merchant: {
      merchantId: '45581',
      merchantAccount: 'thanhtung@tungtung.vn',
      merchantPassword: '4a349e29498e965e3c741a92c50d631c'
    },
    cardBank:
      'https://sandbox.nganluong.vn:8088/nl30/checkout.api.nganluong.post.php',
    cardMobile:
      'https://sandbox.nganluong.vn:8088/nl30/mobile_card.api.post.v2.php'
  }
}
export const PAYMENT_API = IS_SANDBOX ? NGANLUONG.sandbox : NGANLUONG.production

export default {
  PORT,
  MONGODB_OPTIONS,
  PAYMENT_API,
  AUTH_API
}
