import { PAYMENT_API } from 'config'
import queryString from 'query-string'
import md5 from 'md5'
import axios from 'axios'
import xmlParser from 'xml2json'

const TRANSACTION_STATUS = {
  success: '00',
  pending: '01',
  notSuccess: '02'
}

export default {
  /**
   * Parse data
   * @param xmlData
   * @returns {{errorCode: *, token, timeLimit: *, checkoutUrl: *}}
   */
  getReponseData (xmlData) {
    const parsed = JSON.parse(xmlParser.toJson(xmlData))
    const result = parsed.result
    return {
      errorCode: result.error_code,
      token: result.token,
      status: result.transaction_status,
      isSuccess:
        result.transaction_status === TRANSACTION_STATUS.success ||
        result.transaction_status === TRANSACTION_STATUS.pending,
      amount: result.transaction_amount,
      transactionId: result.transaction_id
    }
  },

  /**
   * Get form data to check
   * @param token
   * @returns {Promise<*>}
   */
  getFormData ({ token }) {
    const { merchantId, merchantPassword } = PAYMENT_API.merchant
    return queryString.stringify({
      function: 'GetTransactionDetail',
      version: '3.1',
      merchant_id: merchantId,
      merchant_password: md5(merchantPassword),
      token: token
    })
  },

  /**
   * Send transaction
   * @param token
   * @returns {Promise<*|{errorCode: *, token, timeLimit: *, checkoutUrl: *}>}
   */
  async getTransaction ({ token }) {
    const res = await axios.post(
      PAYMENT_API.cardBank,
      this.getFormData({ token })
    )
    return this.getReponseData(res.data)
  },

  /**
   * Function default export
   * @param errorCode
   * @param token
   * @returns {Promise<*>}
   */
  async submit ({ errorCode, token }) {
    const result = await this.getTransaction({ token })
    return result
  }
}
