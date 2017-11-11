import bodyParser from 'body-parser'
import express from 'express'
import mongoose from 'mongoose'

import config from 'config'
import authRoute from 'routes/authRoute'

// Init app express
const app = express()

// Connect mongodb
mongoose.connect(config.MONGODB_OPTIONS.database)

// Setup bodyparser
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }))
app.use(bodyParser.json())

// Accept header

app.use(function (req, res, next) {
  // TODO Need to define allowed domain
  // Website you wish to allow to connect
  if (app.get('env') === 'development') {
    res.setHeader('Access-Control-Allow-Origin', '*')
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  )

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type, Cache-Control, Authorization'
  )

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello world 23' })
})
app.use('/auth', authRoute)

app.listen(config.PORT, () => {
  console.log(`start server on ${config.PORT}`)
})
