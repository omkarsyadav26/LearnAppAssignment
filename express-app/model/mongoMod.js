const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  totalCount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("inventory", inventorySchema, "inventory");
