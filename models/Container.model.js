const mongoose = require("mongoose");

const containerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  coordinates: {
    type: Map,
    of: Number
  },
  ownedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  parentContainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Container",
    default: null
  },
  subContainers: [
    {
      type: mongoose.Schema.Types.ObjectId,
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
