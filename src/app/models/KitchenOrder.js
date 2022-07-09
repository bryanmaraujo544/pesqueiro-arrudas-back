const mongoose = require('mongoose');

const { Schema } = mongoose;
const { DateTime } = require('luxon');

const kitchenOrderSchema = new Schema({
  createdAt: {
    type: Date,
    default: () => DateTime.local().setZone('UTC-3'),
  },
  commandId: {
    type: String,
    required: true,
  },
  table: {
    type: String,
    required: true,
  },
  waiter: {
    type: String,
    required: true,
  },
  observation: {
    type: String,
    default: '',
  },
  products: [
    {
      _id: String,
      name: String,
      amount: Number,
      isMade: {
        type: Boolean,
        default: false,
      },
    },
  ],
  isMade: {
    type: Boolean,
    default: false,
  },
});

const KitchenOrder = mongoose.model('KitchenOrder', kitchenOrderSchema);

module.exports = KitchenOrder;
