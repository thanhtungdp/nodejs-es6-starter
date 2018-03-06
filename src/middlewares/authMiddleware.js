import fetch from 'node-fetch'
import config from 'config'

var authMiddleware = function (req, res, next) {
  var token =
    req.body.token ||
    req.query.token ||
    req.headers['x-access-token'] ||
    req.headers['authorization']
  if (token) {
    fetch(config.AUTH_API + '/auth/me', {
      headers: {
        Authorization: req.headers['authorization']
      }
    })
      .then(function (data) {
        return data.json()
      })
      .then(function (data) {
        if (data && data.success) {
          req.user = data.data
          next()
        } else {
          res.json({ success: false, message: 'Login error' })
        }
      })
      .catch(function (error) {
        res.json({ success: false, message: error.message })
      })
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provied'
    })
  }
}

export default authMiddleware
