const mongoose = require('mongoose');

const { Schema } = mongoose;

const cashierSchema = new Schema({
  total: {
    type: Number,
    required: true,
  },
  date: Date,
  payments: [
    {
      _id: String,
      total: Number,
      paymentType: String,
      command: [
        {
          _id: String,
          table: String,
          waiter: String,
          total: Number,
          waiterExtra: {
            type: Number,
            default: 0,
          },
          products: [
            {
              _id: String,
              name: String,
              amount: Number,
            },
          ],
        },
      ],
    },
  ],
});

const Cashier = mongoose.model('Cashier', cashierSchema);

module.exports = Cashier;
