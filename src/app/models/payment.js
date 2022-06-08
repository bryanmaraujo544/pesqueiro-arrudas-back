const mongoose = require('mongoose');

const { Schema } = mongoose;

const paymentSchema = new Schema({
  createdAt: {
    type: Date,
    default: () => Date.now(),
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
