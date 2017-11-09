# Dao

Dao (Database access orm) là 1 file chứa các phương thức tương tác với cơ sở dữ liệu.

Ví dụ, 1 user sẽ có các phương thức sau

* Register
* Login
* CheckUserEmmail

Code:
```javascript
import User from 'models/User'
import bcrypt from 'bcrypt'
import jsonWebToken from 'jsonwebtoken'
import { JWT_SECRET } from 'config'

const SALTS = 10

export default {
  /**
   * Check user exists email before register
   * @param email
   * @returns {boolean}
   */
  async checkExistsByEmail (email) {
    return !!await User.findOne({ email })
  },

  /**
   * Register user
   * @param email
   * @param password
   * @returns {*|Promise}
   */
  async register ({ email, password }) {
    let user = new User({ email, password: await bcrypt.hash(password, SALTS) })
    await user.save()
    return user
  },

  /**
   * Login
   * @param email
   * @param password
   * @returns {*}
   */
  async login ({ email, password }) {
    let user = await User.findOne({ email })
    if (!user) return null
    let isLogin = await bcrypt.compare(password, user.password)
    return isLogin ? user : null
  },

  /**
   * Create token from user object
   * @param user
   * @returns {*}
   */
  createToken (user) {
    // Generate token
    var token = jsonWebToken.sign({ _id: user._id }, JWT_SECRET)
    return token
  },

  /**
   * From token to user
   * @param token
   * @returns {boolean}
   */
  async getUserFromToken (token) {
    try {
      // De code token
      let dataDecoded = await jsonWebToken.verify(token, JWT_SECRET)
      if (dataDecoded._id) {
        const user = await User.findOne({ _id: dataDecoded._id })
        return user || false
      }
      return false
    } catch (e) {
      return false
    }
  }
}


// file routes/authRoute
import userDao from 'dao/userDao'
router.post('/login', async (req, res) => {
  let user = await userDao.login({
    email: req.body.email,
    password: req.body.password
  })
  if (!user) {
    resError(Errors.USER_PASSWORD_INCORRECT)
  } else {
    res.json({
      success: true,
      token: userDao.createToken(user),
      data: user
    })
  }
})

```