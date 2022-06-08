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
  totalPayed: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  products: [
    {
      _id: {
        type: String,
        required: true,
      },
      name: String,
      amount: Number,
      unitPrice: Number,
      category: String,
      totalPayed: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  ],
});

const Command = mongoose.model('Command', commandSchema);

module.exports = Command;
