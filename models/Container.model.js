const mongoose = require("mongoose");

const containerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  ownedBy: {
    type: mongoose.ObjectId,
    ref: "User"
  },
  parentContainer: {
    type: mongoose.ObjectId,
    ref: "Container"
  },
  subContainers: [
    {
      type: mongoose.ObjectId,
      ref: "Container"
    }
  ],
  Photos: [
    {
      url: String
    }
  ]
});

const Container = mongoose.model("Container", containerSchema);

module.exports = Container;
