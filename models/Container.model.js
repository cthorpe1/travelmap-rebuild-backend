const mongoose = require("mongoose");

const containerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: "No description entered..."
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
  photos: [String]
});

const Container = mongoose.model("Container", containerSchema);

module.exports = Container;
