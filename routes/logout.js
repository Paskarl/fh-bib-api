const express = require("express");
const user = require("../models/user");
const router = express.Router();
const User = require("../models/user");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();


router.post("/", async (req, res) => {
    res.status(200).json({message: "Bye"})
});

module.exports = router;
