import userDao from 'dao/userDao'
import Errors from 'constants/errors'
import { resError } from 'utils/res'

function getAuthorizationToken (req) {
  return req.headers['authorization'] || req.query.token || req.body.token
}

export default async function authMiddleware (req, res, next) {
  let authToken = getAuthorizationToken(req)
  if (authToken) {
    const user = await userDao.getUserFromToken(authToken)
    if (!user) {
      resError(res, Errors.NOT_AUTHENTICATED)
    } else {
      // If user login, append `user` to req
      req.user = user
      next()
    }
  } else {
    resError(res, Errors.NOT_AUTHENTICATED)
  }
  next()
}
