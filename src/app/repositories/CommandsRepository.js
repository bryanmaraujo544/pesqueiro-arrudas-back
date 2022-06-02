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

  async create({ table, waiter, fishingType }) {
    try {
      const newCommand = new CommandModel({
        table,
        waiter,
        fishingType,
      });

      const command = await newCommand.save();
      return command;
    } catch (error) {
      console.log(error?.message);
      return null;
    }
  }

  async delete(commandId) {
    console.log({ commandId });
  }
}

module.exports = new CommandRepository();
