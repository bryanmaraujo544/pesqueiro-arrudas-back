const mongoose = require('mongoose');
const { Schema } = mongoose;

const commandSchema = new Schema({
  createdAt: String,
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
  products: [
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },
      category: String,
      unitPrice: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        min: 0,
      },
    },
  ],
  total: Number,
});

const Command = mongoose.model('Command', commandSchema);

module.exports = Command;
