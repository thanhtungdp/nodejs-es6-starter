import User from "../models/User";
import express from "express";

var router = express.Router();

router.get('/register',async (req, res) => {
  let user = new User({
    email: 'tungptkh@gmail.com',
    username: 'thanhtungdp'
  });
  try{
  user = await user.save();
  console.log(user);
  res.json({user});
  }
  catch(e){
    console.log(e);
  }
})

export default router;
