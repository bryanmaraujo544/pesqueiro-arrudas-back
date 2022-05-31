const ProductsRepository = require('../repositories/ProductsRepository');
const { someIsEmpty } = require('../utils/someIsEmpty');

class ProductController {
  async index(req, res) {
    const products = await ProductsRepository.findAll();
    res.send(products);
  }

  async store(req, res) {
    const { name, imageURL, unitPrice, amount, category } = req.body;

    const hasFieldEmpty = someIsEmpty([name, unitPrice, amount, category]);
    if (hasFieldEmpty) {
      return res.status(400).json({
        message: 'Campos obrigatórios foram esquecidos.',
        product: null,
      });
    }

    const nameIsInUse = await ProductsRepository.findByName(name);
    if (nameIsInUse.length > 0) {
      return res
        .status(400)
        .json({ message: 'Nome já está em uso.', product: null });
    }

    const newProduct = await ProductsRepository.create({
      name,
      category,
      unitPrice,
      amount,
      imageURL,
    });
    res.status(200).json({ message: 'Produto criado!', product: newProduct });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: 'O ID do produto precisa ser informado para sua deleção.',
      });
    }

    await ProductsRepository.delete(id);
    res.status(200).json({ message: 'Produto deletado' });
  }

  async update(req, res) {
    const { id } = req.params;
    const { name, imageURL, unitPrice, amount, category } = req.body;

    const hasFieldEmpty = someIsEmpty([
      name,
      imageURL,
      unitPrice,
      amount,
      category,
    ]);

    if (hasFieldEmpty) {
      return res.status(400).json({
        message: 'Campos obrigatórios foram esquecidos.',
        product: null,
      });
    }

    const [nameIsInUse] = await ProductsRepository.findByName(name);
    const unchanged = nameIsInUse._id;
    // const nameId = unchanged.replace(/\D/g, '');
    // console.log(nameIsInUse._id);
    // console.log(id);
    console.log({ unchanged });

    if (nameIsInUse && nameIsInUse._id !== id) {
      return res.status(400).json({ message: 'O nome já está em uso' });
    }

    const updatedProduct = await ProductsRepository.update({
      id,
      name,
      category,
      unitPrice,
      amount,
      imageURL,
    });

    return res.json({ updated: updatedProduct });
  }
}

module.exports = new ProductController();
