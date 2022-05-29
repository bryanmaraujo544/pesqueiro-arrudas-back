const ProductModel = require('../models/product');

class ProductsRepository {
  async findAll() {
    const products = await ProductModel.find({});
    return products;
  }

  async create({ name, category, unitPrice, amount, imageURL }) {
    const newProduct = new ProductModel({
      name,
      category,
      unitPrice,
      amount,
      imageURL,
    });

    const product = await newProduct.save();
    return product;
  }

  async delete(producId) {
    await ProductModel.deleteOne({ _id: producId });
  }

  async findByName(name) {
    const product = await ProductModel.find({ name });
    return product;
  }
}

module.exports = new ProductsRepository();
