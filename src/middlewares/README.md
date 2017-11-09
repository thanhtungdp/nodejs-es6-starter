# Middleware

Middleware là 1 function nhận các tham số (request, response, next), xử lý các tham số phù hợp với các điều kiện, trước khi được các route xử lý.

Case: `/auth/me` là được dẫn cần phải có token được truyền `authorization`, và token này phải tồn tại trên hệ thống, thì mới có thể truy cập và lấy thông tin user.

Code
```
// middlewares/authMiddleware.js

function getHeaderToken(req){
  return req.headers['authorization']
}

export default function authMiddleware(req, res, next){
  var headerToken = getHeaderToken(req);
  if(!headerToken){
    res.json({error: true, message: 'NOT_TOKEN_INPUT'})
    // Không có quyền truy cập
    return
  }
  // Nếu như có headerToken check xem có tồn tại hay không
  var user = await getUserFromToken(headerToken);
  if(!user){
    res.json({error: true, message: 'NOT_TOKEN_EXISTS'})
    return
  }
  // Nếu như user tồn tại, thì sẽ gán qreq.userq, và các route phía sau sẽ đọc được thông tin user từ `req`
  req.user = user;
}


// Sử dụng ở file routes/authRoute.js
import authMiddleware from 'middlewares/authMiddleware'

router.get('/me', authMiddleware, (req, res) => {
  res.json({user: req.user})
})

```