const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    max: 1024,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  is_admin: {
    type: Boolean,
    default: false,
  },
  reservations: [
    {
      roomNumber: {
        type: String,
        default: 0,
      },
      timeSlot: {
        type: String,
        default: 0,
      },
      pending: {
        type: Boolean,
        default: true,
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
