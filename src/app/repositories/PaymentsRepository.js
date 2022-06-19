const { DateTime } = require('luxon');
const Command = require('../models/command');
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

  async dropPayments({ date }) {
    try {
      const payments = await PaymentModel.find({});
      const paymentsOf10DayAgo = payments.filter(({ createdAt }) => {
        const dt = DateTime.fromJSDate(createdAt);

        if (
          dt.day === date.day &&
          dt.month === date.month &&
          dt.year === date.year
        ) {
          return true;
        }
        return false;
      });

      if (paymentsOf10DayAgo.length === 0) {
        return;
      }

      const paymentsIds = paymentsOf10DayAgo.map(({ _id }) => _id.valueOf());

      if (paymentsIds.length > 0) {
        paymentsIds?.forEach((_id) => {
          (async () => {
            await PaymentModel.deleteOne({ _id });
          })();
        });
      }

      const commandsIds = paymentsOf10DayAgo.map(({ command }) =>
        command.valueOf()
      );

      commandsIds.forEach((_id) => {
        (async () => {
          await Command.deleteOne({ _id });
        })();
      });
      return;
    } catch (error) {
      console.log('Error in dropPayments', error.message);
    }
  }
}

module.exports = new PaymentsRepository();
