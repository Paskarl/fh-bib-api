const express = require("express");
const user = require("../models/user");
const router = express.Router();
const User = require("../models/user");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Login
router.post("/", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  //check if the user is alreasy in the db
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({ message: "E-Mail or password is wrong" });
  } catch (error) {}

  //check if password is correct
  try {
    const user = await User.findOne({ email: req.body.email });
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass)
      return res.status(400).json({ message: "Password invalid" });
  } catch (error) {}

  //Create and assing a token
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({ message: "E-Mail or password is wrong" });
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    console.log("User: " + user.name + " logged in");
    if(user.is_admin == true){
      res.header("auth-token", token).json({ token: token, user: user, admin: user.is_admin });
    }
    else {
      res.header("auth-token", token).json({ token: token, user: user });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



async function getUser(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "cannot find user" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.user = user;
  next();
}

module.exports = router;
