import queryString from 'query-string'
import axios from 'axios/index'
import { PAYMENT_API, PUBLIC_URL } from 'config'
import md5 from 'md5'
import Errors from 'constants/errors'
import xmlParser from 'xml2json'

const { PAYMENT } = Errors

function getError (errorCode) {
  switch (errorCode) {
    case '00':
      return ''
    case '99':
      return PAYMENT.ERROR_NOT_MODIFY
    case '01':
      return PAYMENT.API_DENIED
    case '02':
      return PAYMENT.MERCHANT_NOT_VALIDATE
    case '03':
      return PAYMENT.MERCHANT_IS_LOCKED
    case '04':
      return PAYMENT.MD5_CHECK_SUM
    case '05':
      return PAYMENT.MERCHANT_NOT_EXISTS
    case '06':
      return PAYMENT.MERCHANT_IS_LOCKED
    case '07':
      return PAYMENT.CARD_MOBILE_USED
    case '08':
      return PAYMENT.CARD_MOBILE_LOCKED
    case '09':
      return PAYMENT.CARD_MOBILE_EXPIRED
    case '10':
      return PAYMENT.CARD_MOBILE_NOT_ACTIVE
    case '11':
      return PAYMENT.CARD_MOBILE_CODE_INVALID
    case '12':
      return PAYMENT.CARD_MOBILE_SERIAL_INVALID
    case '13':
      return PAYMENT.CARD_MOBILE_NOT_ACTIVE
    case '14':
      return PAYMENT.CARD_MOBILE_NOT_EXISTS
    case '15':
      return PAYMENT.CARD_MOBILE_NOT_USED
    case '16':
      return PAYMENT.CARD_MOBILE_LIMIT
    case '17':
      return PAYMENT.SERVER_TELCO_LIMIT
    case '18':
      return PAYMENT.SERVER_TELCO_CONNECT_PARTNER
    case '19':
      return PAYMENT.SERVER_TELCO_CONNECT_PARTNER
    case '20':
      return PAYMENT.SERVER_TELCO_CONNECT_PARTNER
    default:
      return PAYMENT.ERROR_NOT_MODIFY
  }
}

export default {
  /**
   * Decode data from string
   * @param dataString
   * @returns {{error_code: *|string, merchant_id: *|string, merchant_account: *|string, pin_card: *|string, card_serial: *|string, type_card: *|string, ref_code: *|string, client_fullname: *|string, client_email: *|string, client_mobile: *|string, card_amount: *|string, transaction_amount: *|string, transaction_id: *|string}}
   */
  getReponseData (xmlData) {
    const parsed = JSON.parse(xmlParser.toJson(xmlData))
    const result = parsed.result
    return {
      errorCode: result.error_code,
      token: result.token,
      timeLimit: result.time_limit,
      checkoutUrl: result.checkout_url
    }
  },

  /**
   * Get form data submit
   * @param code
   * @param serial
   * @param cardType
   * @param user
   * @returns {*}
   */
  getFormSubmit (data) {
    const { amount, paymentMethod, bankCode, name, description, user } = data
    const {
      merchantId,
      merchantAccount,
      merchantPassword
    } = PAYMENT_API.merchant
    return queryString.stringify({
      function: 'SetExpressCheckout',
      version: '3.1',
      merchant_id: merchantId,
      merchant_password: md5(merchantPassword),
      receiver_email: merchantAccount,
      order_code: 'random',
      total_amount: amount,
      payment_method: paymentMethod,
      bank_code: bankCode,
      payment_type: 1,
      order_description: description,
      tax_amount: 0,
      discount_amount: 0,
      fee_shipping: 0,
      buyer_fullname: user.fullname,
      buyer_email: user.email,
      buyer_mobile: user.phoneMobile,
      cur_code: 'vnd',
      total_item: 1,
      item_name1: name,
      item_quantity1: 1,
      item_amount1: amount,
      return_url: `${PUBLIC_URL}/card-bank/callback/success`,
      cancel_url: `${PUBLIC_URL}/card-bank/callback/fail`
    })
  },

  /**
   * Clean Response
   * @param response
   * @returns {{errorCode: *|string, error: string|*, amount: *|string, realAmount: *|string, transactionId: *|string}}
   */
  cleanResponse (response) {
    const error =
      response.error_code === '00'
        ? {}
        : {
          errorCode: response.error_code,
          error: getError(response.error_code)
        }
    return {
      ...error,
      amount: parseFloat(response.card_amount),
      realAmount: parseFloat(response.transaction_amount),
      transactionId: response.transaction_id
    }
  },

  /**
   * Send data
   * @param code
   * @param serial
   * @param cardType
   * @param user
   * @returns {Promise<*|{error_code: *, merchant_id: *, merchant_account: *, pin_card: *, card_serial: *, type_card: *, ref_code: *, client_fullname: *, client_email: *, client_mobile: *, card_amount: *, transaction_amount: *, transaction_id: *}>}
   */
  async sendData (data) {
    const res = await axios.post(PAYMENT_API.cardBank, this.getFormSubmit(data))
    return this.getReponseData(res.data)
  },

  /**
   * Submit card bank
   */
  async submit (data) {
    const response = await this.sendData(data)
    return response
  }
}
