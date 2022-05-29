const ProductModel = require('../models/product');

class ProductsRepository {
  async findAll() {
    const products = await ProductModel.find({});
    return products;
  }

  create({ name, category, unitPrice, amount, imageURL }) {
    const newProduct = new ProductModel({
      name,
      category,
      unitPrice,
      amount,
      imageURL,
    });

    newProduct.save((err) => {
      if (err) {
        console.log('err ocurred creating new product document', err);
      }
    });
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
