const mongoose = require("mongoose");

//Define Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
  },
  {
    timestamps: true
  }
);

//Define Model
const User = mongoose.model("User", userSchema);

module.exports = User;
