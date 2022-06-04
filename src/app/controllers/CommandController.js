const CommandsRepository = require('../repositories/CommandsRepository');
const { someIsEmpty } = require('../utils/someIsEmpty');

class CommandController {
  async index(req, res) {
    const products = await CommandsRepository.findAll();
    res.send(products);
  }

  async store(req, res) {
    const { table, waiter, fishingType } = req.body;

    const hasFieldEmpty = someIsEmpty([table, waiter, fishingType]);
    if (hasFieldEmpty) {
      return res.status(400).json({
        message: 'Campos obrigatórios foram esquecidos.',
        product: null,
      });
    }

    // If one command that it's active has the same name, we throw an error
    const tableExists = await CommandsRepository.findByTable({ table });
    if (tableExists) {
      return res.status(400).json({
        message: 'O nome da mesa já está em uso.',
        product: null,
      });
    }

    const newCommand = await CommandsRepository.create({
      table,
      waiter,
      fishingType,
    });
    return res.json({ message: 'Comanda adicionada', command: newCommand });
  }

  async update(req, res) {
    const { id } = req.params;
    const { table, waiter, fishingType, total, isActive, products } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: 'ID é necessário. ', command: null });
    }

    const commandExists = await CommandsRepository.findById(id);
    if (!commandExists) {
      return res
        .status(400)
        .json({ message: 'Esta comanda não existe', command: null });
    }

    const tableExists = await CommandsRepository.findByTable({ table });
    if (tableExists && tableExists._id.valueOf() !== id) {
      return res
        .status(400)
        .json({ message: 'Já existe uma mesa com este nome', command: null });
    }

    // TODO: verify the amount of products added in stock

    const updatedCommand = await CommandsRepository.update({
      _id: id,
      table,
      waiter,
      fishingType,
      total,
      isActive,
      products,
    });

    if (updatedCommand === null) {
      return res.status(500).json({ message: 'Erro Interno', command: null });
    }

    res.json({ message: 'Comanda atualizada', command: updatedCommand });
  }

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

  async show(req, res) {
    const { id } = req.params;

    const command = await CommandsRepository.findById(id);

    if (!command) {
      return res
        .status(404)
        .json({ message: 'Comanda não encontrada', command: null });
    }

    return res.json({ message: 'Comanda encontrada ', command });
  }
}

module.exports = new CommandController();
