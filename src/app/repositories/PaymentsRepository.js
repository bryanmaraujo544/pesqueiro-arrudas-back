const PaymentModel = require('../models/payment');

class PaymentsRepository {
  async findAll() {
    const payments = await PaymentModel.find({});
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
