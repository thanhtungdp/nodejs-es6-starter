import bodyParser from 'body-parser';
import express from 'express';
import mongoose from 'mongoose';

import config from './config';
//import {secretCodeMiddleware} from './middlewares';

// Init app express
const app = express();
mongoose.connect(config.MONGODB_OPTIONS.database);
app.use(bodyParser.urlencoded({extended: true, limit: '100mb'}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ok: true})
})

app.listen(config.PORT, () => {
  console.log(`listen on ${config.PORT}`);
});

