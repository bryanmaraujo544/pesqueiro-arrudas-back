const CommandsRepository = require('../repositories/CommandsRepository');
const ProductsRepository = require('../repositories/ProductsRepository');
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

    const products = [];

    if (fishingType.toLowerCase() === 'pesca esportiva') {
      const [{ _id, name, imageURL, category, unitPrice }] =
        await ProductsRepository.findByName('Pesca Esportiva');
      products.push({ _id, name, imageURL, category, unitPrice, amount: 1 });
    }

    if (fishingType.toLowerCase() === 'pesque pague') {
      const [{ _id, name, imageURL, category, unitPrice }] =
        await ProductsRepository.findByName('Pesque Pague');
      products.push({ _id, name, imageURL, category, unitPrice, amount: 1 });
    }

    console.log({ products });
    const commandTotal = products
      ?.reduce(
        (amount, current) => amount + current.amount * current.unitPrice,
        0
      )
      .toFixed(2);
    console.log({ commandTotal });

    const newCommand = await CommandsRepository.create({
      table,
      waiter,
      fishingType,
      products,
      total: Number(commandTotal) || 0,
    });
    return res.json({ message: 'Comanda adicionada', command: newCommand });
  }

  async update(req, res) {
    const { id } = req.params;
    const { table, waiter, fishingType, isActive, products } = req.body;

    if (!id) {
      return res
        .status(400)
        .json({ message: 'ID é necessário. ', command: null });
    }

    const commandToUpdate = await CommandsRepository.findById(id);
    if (!commandToUpdate) {
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
    const commandTotal = Number(
      products?.reduce(
        (amount, current) => amount + current.amount * current.unitPrice,
        0
      )
    ).toFixed(2);

    const commandPayedTotal = Number(
      products?.reduce(
        (amount, current) => amount + Number(current.totalPayed),
        0
      )
    ).toFixed(2);

    if (commandPayedTotal > commandToUpdate.total) {
      return res
        .status(400)
        .json({ message: 'Valor pago maior que o necessário', command: null });
    }

    const updatedCommand = await CommandsRepository.update({
      _id: id,
      table,
      waiter,
      fishingType,
      total: commandTotal,
      isActive,
      products,
      totalPayed: commandPayedTotal,
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
