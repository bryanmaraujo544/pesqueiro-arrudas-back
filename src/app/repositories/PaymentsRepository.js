const { DateTime } = require('luxon');
const PaymentModel = require('../models/payment');

class PaymentsRepository {
  async findAll({ date }) {
    const payments = await PaymentModel.find({}).populate('command');

    const dt = DateTime.fromISO(date);

    if (date) {
      return payments.filter((payment) => {
        const pdt = DateTime.fromJSDate(payment.createdAt);

        if (
          dt.day === pdt.day &&
          dt.month === pdt.month &&
          dt.year === pdt.year
        ) {
          return true;
        }
        return false;
      });
    }
    return payments;
  }

  async create({ commandId, paymentType, totalPayed }) {
    try {
      const newPayment = new PaymentModel({
        command: commandId,
        paymentType,
        totalPayed,
      });

      const paymentStored = await newPayment.save();

      const payment = await PaymentModel.find({
        _id: paymentStored._id,
      }).populate('command');
      return payment;
    } catch (error) {
      console.log(`PaymentRepository.create: ${error.message}`);
    }
  }
}

module.exports = new PaymentsRepository();
