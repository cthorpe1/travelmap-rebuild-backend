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
    containers: [
      {
        type: mongoose.ObjectId,
        ref: "Container"
      }
    ]
  },
  {
    timestamps: true
  }
);

//Define Model
const User = mongoose.model("User", userSchema);

module.exports = User;
