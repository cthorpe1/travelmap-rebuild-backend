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
  isTopLevel: {
    type: Boolean,
    default: false
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
