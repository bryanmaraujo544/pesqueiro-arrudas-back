const CommandsRepository = require('../repositories/CommandsRepository');
const { someIsEmpty } = require('../utils/someIsEmpty');

class CommandController {
  async index(req, res) {
    const products = await CommandsRepository.findAll();
    res.send(products);
  }

  async store(req, res) {
    // TODO: If a product is already in the command, dont let the user add it.
    // Add fishingType as a product
    const createdAt = new Date().toISOString();
    const products = [
      {
        name: 'fdfd',
        amount: 4,
        unitPrice: 4.5,
      },
    ];

    const { table, waiter, fishingType } = req.body;

    const hasFieldEmpty = someIsEmpty([table, waiter, fishingType]);
    if (hasFieldEmpty) {
      return res.status(400).json({
        message: 'Campos obrigatórios foram esquecidos.',
        product: null,
      });
    }

    // Fix this. If a table was already created at other day, it cannot be created again.
    const tableExists = await CommandsRepository.findByTable({ table });
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

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'O ID da comanda precisa ser informado para sua deleção.',
      });
    }

    await CommandsRepository.delete(id);
    res.status(200).json({ message: 'Comanda deletada' });
  }
}

module.exports = new CommandController();
