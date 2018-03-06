import queryString from 'query-string'
import axios from 'axios/index'
import { PAYMENT_API } from 'config'
import Errors from 'constants/errors'
import md5 from 'md5'

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
  getReponseData (dataString) {
    const dataDecode = dataString.split('|')
    const response = {
      error_code: dataDecode[0],
      merchant_id: dataDecode[1],
      merchant_account: dataDecode[2],
      pin_card: dataDecode[3],
      card_serial: dataDecode[4],
      type_card: dataDecode[5],
      ref_code: dataDecode[6],
      client_fullname: dataDecode[7],
      client_email: dataDecode[8],
      client_mobile: dataDecode[9],
      card_amount: dataDecode[10],
      transaction_amount: dataDecode[11],
      transaction_id: dataDecode[12]
    }
    return response
  },

  /**
   * Get form data submit
   * @param code
   * @param serial
   * @param cardType
   * @param user
   * @returns {*}
   */
  getFormSubmit ({ code, serial, cardType, user }) {
    const {merchantId, merchantAccount, merchantPassword} = PAYMENT_API.merchant
    return queryString.stringify({
      func: 'CardCharge',
      version: '2.0',
      merchant_id: merchantId,
      merchant_account: merchantAccount,
      merchant_password: md5(`${merchantId}|${merchantPassword}`),
      pin_card: code,
      card_serial: serial,
      type_card: cardType,
      ref_code: '1234',
      client_fullname: user.fullname,
      client_email: user.email,
      client_mobile: user.mobile
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
  async sendData ({ code, serial, cardType, user }) {
    const res = await axios.post(
      PAYMENT_API.cardMobile,
      this.getFormSubmit({ code, serial, cardType, user })
    )
    return this.getReponseData(res.data)
  },

  /**
   * Submit Card Mobile
   * @param code
   * @param serial
   * @param cardTYpe
   * @param user
   * @returns {Promise<void>}
   */
  async submit ({ code, serial, cardType, user }) {
    const response = this.cleanResponse(
      await this.sendData({ code, serial, cardType, user })
    )
    return response
  }
}
