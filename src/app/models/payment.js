const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const { Schema } = mongoose;

const paymentSchema = new Schema({
  createdAt: {
    type: String,
    default: () => DateTime.now().toISO(),
  },
  totalPayed: {
    type: Number,
    required: true,
  },
  command: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Command',
  },
  paymentType: {
    type: String,
    required: true,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
