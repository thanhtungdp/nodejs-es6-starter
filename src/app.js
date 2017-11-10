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

// Routes
app.get('/', (req, res) => {
  res.json({message: 'Hello world 23456'})
})
app.use('/auth', authRoute)

app.listen(config.PORT, () => {
  console.log(`start server on ${config.PORT}`)
})
