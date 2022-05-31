const CommandModel = require('../models/command');

class CommandRepository {
  async findAll() {
    const products = await CommandModel.find({});
    return products;
  }

  async findByTable({ table }) {
    const product = await CommandModel.findOne({ table });
    return product;
  }
}

module.exports = new CommandRepository();
