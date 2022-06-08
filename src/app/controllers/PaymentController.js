const PaymentsRepository = require('../repositories/PaymentsRepository');
const CommandsRepository = require('../repositories/CommandsRepository');
const { someIsEmpty } = require('../utils/someIsEmpty');

class PaymentController {
  async index(req, res) {
    const payments = await PaymentsRepository.findAll({});
    res.send(payments);
  }

  async pay(req, res) {
    const { commandId, paymentType } = req.body;

    const hasSomeEmpty = someIsEmpty([commandId, paymentType]);
    if (hasSomeEmpty) {
      return res.status(400).json({
        message: 'Campos necessários não foram informados',
        paymentInfos: null,
      });
    }

    const commandToPay = await CommandsRepository.findById(commandId);

    if (!commandToPay) {
      return res
        .status(400)
        .json({ message: 'Comanda não existe', paymentInfos: null });
    }

    // Update the command.totalPayed to the total value to be payed
    await CommandsRepository.update({
      _id: commandId,
      totalPayed: commandToPay.total,
    });

    // Create the payment
    const paymentCreated = await PaymentsRepository.create({
      commandId,
      paymentType,
      totalPayed: commandToPay.total,
    });

    res.json({ message: 'Comanda paga!', paymentInfos: paymentCreated });
  }
}

module.exports = new PaymentController();
