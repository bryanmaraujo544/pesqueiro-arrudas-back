const ProductsRepository = require('../repositories/ProductsRepository');
const { someIsEmpty } = require('../utils/someIsEmpty');

class ProductController {
  async index(req, res) {
    const products = await ProductsRepository.findAll();
    res.send(products);
  }

  async store(req, res) {
    const { name, imageURL, unitPrice, amount, category } = req.body;
    console.log(name, imageURL, unitPrice, amount, category);

    const hasFieldEmpty = someIsEmpty([name, unitPrice, amount, category]);
    if (hasFieldEmpty) {
      return res
        .status(400)
        .json({ message: 'Campos obrigatórios foram esquecidos.' });
    }

    const nameIsInUse = await ProductsRepository.findByName(name);
    console.log({ nameIsInUse });
    console.log(!![]);
    if (nameIsInUse.length > 0) {
      return res.status(400).json({ message: 'Nome já está em uso.' });
    }

    ProductsRepository.create({ name, category, unitPrice, amount, imageURL });
    res.status(200).json({ message: 'Produto criado! ' });
  }
}

module.exports = new ProductController();
