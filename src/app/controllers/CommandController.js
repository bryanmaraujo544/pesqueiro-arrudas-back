const CommandsRepository = require('../repositories/CommandsRepository');

class CommandController {
  async index(req, res) {
    const products = await CommandsRepository.findAll();
    res.send(products);
  }

  async store(req, res) {
    const createdAt = new Date().toISOString();
    const products = [];

    // Add fishingType as a product
    const { table, waiter, fishingType } = req.body;

    const hasFieldEmpty = someIsEmpty([table, waiter, fishingType]);
    if (hasFieldEmpty) {
      return res.status(400).json({
        message: 'Campos obrigatórios foram esquecidos.',
        product: null,
      });
    }

    const tableExists = await CommandsRepository.findByTable({ table });
    console.log(tableExists);
    if (tableExists) {
      return res.status(400).json({
        message: 'O nome da mesa já está em uso.',
        product: null,
      });
    }

    const newCommand = await CommandsRepository.create({
      createdAt,
      table,
      waiter,
      fishingType,
      products,
    });
    return res.json({ message: 'Comanda adicionada', command: newCommand });
  }

  update() {}

  delete() {}
}

module.exports = new CommandController();
