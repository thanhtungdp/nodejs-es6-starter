import express from 'express'

import authMiddleware from 'middlewares/authMiddleware'
import Errors from 'constants/errors'
import userDao from 'dao/userDao'
import { resError } from 'utils/res'

var router = express.Router()

/**
 * Register
 * @param body: email, password
 */
router.post('/register', async (req, res) => {
  const userIsExists = await userDao.checkExistsByEmail(req.body.email)
  if (userIsExists) {
    resError(res, Errors.USER_REGISTER_EXISTS)
  }
  let userData = {
    email: req.body.email,
    password: req.body.password
  }
  const userCreate = await userDao.register(userData)
  res.json({ success: true, data: userCreate })
})

/**
 * Login
 * @param body: email, password
 */
router.post('/login', async (req, res) => {
  let user = await userDao.login({
    email: req.body.email,
    password: req.body.password
  })
  if (!user) {
    resError(res, Errors.USER_PASSWORD_INCORRECT)
  } else {
    res.json({
      success: true,
      token: userDao.createToken(user),
      data: user
    })
  }
})

/**
 * Protected route by **authMiddlware**, require req must have header Authoraization
 */
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ data: req.user })
})

export default router
