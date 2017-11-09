# Constants

Chứa các thông số mặc định được cấu hình, ví dụ như Errors message, hoặc các UserType, Acl, ...

```javascript
// constants/errors.js
export default {
  USER_PASSWORD_INCORRECT: 'USER_PASSWORD_INCORRECT',
  USER_REGISTER_EXISTS: 'USER_REGISTER_EXISTS',
  NOT_AUTHENTICATED: 'NOT_AUTHENTICATED'
}


// routes/authRoute.js
import Errors from 'constants/errors'

router.get('/user', (req, res) => {
  if(!checkLogin(req)){
    res.json({error: true, message: Errors.NOT_AUTHENTICATED})
  }
})
``