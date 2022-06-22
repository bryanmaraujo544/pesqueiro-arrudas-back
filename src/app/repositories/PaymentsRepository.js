const { DateTime } = require('luxon');
const Command = require('../models/command');
const PaymentModel = require('../models/payment');

class PaymentsRepository {
  async findAll({ date }) {
    const payments = await PaymentModel.find({}).populate('command');

    const dt = DateTime.fromISO(date, { zone: 'pt-BR', setZone: true });

    if (date) {
      return payments.filter((payment) => {
        let pdt;

        pdt = DateTime.fromISO(payment.createdAt, {
          zone: 'pt-BR',
          setZone: true,
        });

        if (!pdt) {
          pdt = DateTime.fromJSDate(date, { zone: 'pt-BR', setZone: true });
        }

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

  async create({ commandId, paymentType, totalPayed, waiterExtra }) {
    try {
      const createdAt = DateTime.now().toISO();

      const newPayment = new PaymentModel({
        command: commandId,
        paymentType,
        totalPayed,
        createdAt,
        waiterExtra,
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
        const dt = DateTime.fromJSDate(createdAt).setLocale('pt-BR');

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

  async deleteAll() {
    await PaymentModel.deleteMany({});
  }
}

module.exports = new PaymentsRepository();
