const express = require("express");
const user = require("../models/user");
const router = express.Router();
const User = require("../models/user");
const { registerValidation, loginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const verify = require("./verifyToken");

require("dotenv").config();

// Create Reservation
router.post("/:id", verify, getUser, async (req, res) => {
  if (req.body.reservations != null) {
    res.user.reservations.push({
      roomNumber: req.body.reservations.roomNumber,
      timeSlot: req.body.reservations.timeSlot,
      pending: req.body.reservations.pending,
    });
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/pending", verify, getPendingReservation, async (req, res) => {
  res.status(200).json(res.pending);
});

router.patch("/grant/:id", getPendingReservation, async (req, res) => {
  let current_user;
  let current_user_id;
  let current_index;
  try {
    res.pending.forEach((element, index, array) => {
      const reserArray = element.reservations;
      reserArray.forEach((element, index, array) => {
        if (element._id == req.params.id) {
          element.pending = false;
          current_user_id = element.parent()._id.toString();
        }
      });
      current_index = index;
    });
  } catch (error) {}
  try {
    const updatedUser = await res.pending[current_index].save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", getReservation, async (req, res) => {
  let current_index;
  res.reservations.forEach((element, index) => {
    const test = element.reservations;
    test.forEach((element, index) => {
      if (element._id == req.params.id) {
        test.splice(index, 1);
      }
    });
    current_index = index;
  });
  try {
    let updatedUser = await res.reservations[current_index];
    if (updatedUser == null) {
      res.status(400).json({ message: "Reservation could not be found" });
    } else {
      updatedUser = await res.reservations[current_index].save();
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

async function getPendingReservation(req, res, next) {
  let reservation;
  try {
    reservation = await User.find({ "reservations.pending": true });
    if (reservation == null) {
      return res.status(400).json({ message: "Fehler" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.pending = reservation;
  next();
}

async function getReservation(req, res, next) {
  let reservation;
  try {
    reservation = await User.find({ "reservations._id": req.params.id });
    if (reservation == null) {
      return res.status(400).json({ message: "Fehler" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.reservations = reservation;
  next();
}

module.exports = router;
