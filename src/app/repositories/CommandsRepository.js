/* eslint-disable no-unused-vars */
const CommandModel = require('../models/command');

class CommandRepository {
  async create({ table, waiter, fishingType, products, total }) {
    try {
      const newCommand = new CommandModel({
        table,
        waiter,
        fishingType,
        products,
        total,
      });

      const command = await newCommand.save();

      return command;
    } catch (error) {
      console.log(error?.message);
      return null;
    }
  }

  async update({
    _id,
    table,
    waiter,
    fishingType,
    total,
    isActive,
    products,
    totalPayed,
  }) {
    try {
      await CommandModel.updateOne(
        { _id },
        {
          $set: {
            table,
            waiter,
            fishingType,
            total,
            isActive,
            products,
            totalPayed: totalPayed && Number(totalPayed),
          },
        }
      );

      const updatedCommand = await CommandModel.findOne({ _id });
      return updatedCommand;
    } catch (error) {
      console.log(error.message);
      // process.exit(1);
      return null;
    }
  }

  async delete(commandId) {
    await CommandModel.deleteOne({ _id: commandId });
  }

  async findAll() {
    const commands = await CommandModel.find({});
    return commands;
  }

  async findCurrentDayCommands() {
    const todayDayInMonth = new Date().getDate();
    const todayMonth = new Date().getMonth();
    const todayYear = new Date().getFullYear();

    const allCommands = await CommandModel.find({});
    const todayCommands = await allCommands.filter((command) => {
      const createdAtDate = new Date(command.createdAt);
      return (
        createdAtDate.getDate() === todayDayInMonth &&
        createdAtDate.getMonth() === todayMonth &&
        createdAtDate.getFullYear() === todayYear
      );
    });
    return todayCommands;
  }

  async findByTable({ table }) {
    const command = await CommandModel.findOne({ table, isActive: true });
    return command;
  }

  async findById(id) {
    try {
      const command = await CommandModel.findOne({ _id: id });
      return command;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}

module.exports = new CommandRepository();
