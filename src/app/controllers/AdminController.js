const PaymentsRepository = require('../repositories/PaymentsRepository');

class AdminController {
  async deletePayments(req, res) {
    // DANGER
    await PaymentsRepository.deleteAll();
    res.json({ message: 'All Payments deleted.' });
  }
}

module.exports = new AdminController();
