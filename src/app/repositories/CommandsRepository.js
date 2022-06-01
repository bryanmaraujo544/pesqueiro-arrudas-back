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

  async create({ createdAt, table, waiter, fishingType, products }) {
    const newCommand = new CommandModel({
      createdAt,
      table,
      waiter,
      fishingType,
      products,
    });

    const command = await newCommand.save();
    return command;
  }

  async delete(commandId) {
    await CommandModel.deleteOne({ _id: commandId });
  }
}

module.exports = new CommandRepository();
