# Route

Ví dụ về khởi tạo 1 authRoute xử lý register, login/


Code:
```javscript
// routes/authRoute.js

import express from 'express'
var router = express.Router()

router.post('/register', (req, res) => {
  res.json({ register: true })
})

router.post('/login', (req, res) => {
  res.json({ register: true })
})

export default router

```