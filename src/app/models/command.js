const mongoose = require('mongoose');

const { Schema } = mongoose;

const commandSchema = new Schema({
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
  table: {
    type: String,
    required: true,
    maxLength: 128,
  },
  waiter: {
    type: String,
    required: true,
  },
  fishingType: String,
  total: { type: Number, default: 0 },
  isActive: { type: String, default: true },
  products: [],
});

const Command = mongoose.model('Command', commandSchema);

module.exports = Command;
