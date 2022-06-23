const CommandsRepository = require('../repositories/CommandsRepository');
const PaymentsRepository = require('../repositories/PaymentsRepository');

class AdminController {
  async deletePayments(req, res) {
    // DANGER
    await PaymentsRepository.deleteAll();
    res.json({ message: 'All Payments deleted.' });
  }

  async deleteCommands(req, res) {
    // DANGER
    await CommandsRepository.deleteAll();
    res.json({ message: 'All Commands deleted.' });
  }
}

module.exports = new AdminController();
