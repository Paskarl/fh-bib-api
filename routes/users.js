const express = require("express");
const user = require("../models/user");
const router = express.Router();
const User = require("../models/user");
const { registerValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const verify = require("./verifyToken");

// Get all users
router.get("/", verify, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get one user
router.get("/:id", getUser, (req, res) => {
  res.json(res.user);
});

// Create one user
// router.post("/", async (req, res) => {
//   //Validation
//   const { error } = registerValidation(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   //check if the user is alreasy in the db
//   try {
//     const emailExist = await User.findOne({ email: req.body.email });
//     if (emailExist)
//       return res.status(400).json({ message: "E-Mail already exists" });
//   } catch (error) {}

//   // Hash passwords
//   const salt = await bcrypt.genSalt(10);
//   const hashPassword = await bcrypt.hash(req.body.password, salt);

//   const user = new User({
//     name: req.body.name,
//     matrNumber: req.body.matrNumber,
//     email: req.body.email,
//     password: hashPassword,
//   });
//   try {
//     const newUser = await user.save();
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// Update one user
router.patch("/:id", getUser, async (req, res) => {
  if (req.body.name != null) {
    res.user.name = req.body.name;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one user
router.delete("/:id", getUser, async (req, res) => {
  try {
    await res.user.remove();
    res.status(200).json({ message: "User Deleted" });
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
