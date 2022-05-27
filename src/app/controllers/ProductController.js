const ProductsRepository = require('../repositories/ProductsRepository');

class ProductController {
  async index(req, res) {
    const products = await ProductsRepository.findAll();
    res.send(products);
  }

  store(req, res) {
    const { name, imageURL, unitPrice, amount, category } = req.body;
    ProductsRepository.create({ name, category, unitPrice, amount, imageURL });
    res.status(200).json({ message: 'Product Created' });
  }
}

module.exports = new ProductController();
