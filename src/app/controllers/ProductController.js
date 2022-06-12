// const { O} = require('mongoose');

const ProductsRepository = require('../repositories/ProductsRepository');
const { isOneSpecialProduct } = require('../utils/isOneSpecialProduct');
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

    if (!imageURL && imageURL !== '') {
      return res.status(400).json({
        message: 'Campos obrigatórios foram esquecidos.',
        product: null,
      });
    }

    const hasFieldEmpty = someIsEmpty([name, unitPrice, amount, category]);

    if (hasFieldEmpty) {
      return res.status(400).json({
        message: 'Campos obrigatórios foram esquecidos.',
        product: null,
      });
    }

    const [productWithSameName] = await ProductsRepository.findByName(name);
    const productWithSameNameId = productWithSameName?._id?.valueOf();

    if (productWithSameName && productWithSameNameId !== id) {
      return res
        .status(400)
        .json({ message: 'O nome já está em uso', product: null });
    }

    const updatedProduct = await ProductsRepository.update({
      id,
      name,
      category,
      unitPrice,
      amount,
      imageURL,
    });

    return res.json({ message: 'Produto atualizado', product: updatedProduct });
  }

  async verifyTheAmount(req, res) {
    const { productId, amount } = req.body;

    if (!productId || !amount) {
      return res.status(400).json({
        message: 'O ID do produto e a quantidade precisam ser informados.',
        isInStock: false,
      });
    }

    const productToVerify = await ProductsRepository.findById(productId);
    if (amount > productToVerify.amount) {
      return res.status(400).json({
        message: 'Quantidade maior do que o estoque do produto',
        isInStock: false,
      });
    }

    return res.json({ message: 'Produto em estoque', isInStock: true });
  }

  async updateAmount(req, res) {
    const { operation } = req.query;
    const { productId, amount } = req.body;
    if (!productId || (!amount && amount !== 0)) {
      return res.status(400).json({
        message: 'Campos obrigatórios não foram informados.',
        isAllowed: false,
      });
    }

    if (Number.isNaN(Number(amount))) {
      return res.status(400).json({
        message: 'Valor de quantidade está inválido',
        isAllowed: false,
      });
    }

    // I am receiving the updatedAmount, so I need to grab the difference between the old value.
    const productToUpdate = await ProductsRepository.findById(productId);
    if (!productToUpdate) {
      return res
        .status(400)
        .json({ message: 'Não há comanda com esse Id', isAllowed: false });
    }

    const oldAmount = await productToUpdate.amount;
    const isProductWithoutAmount = isOneSpecialProduct(productToUpdate.name);

    if (operation === 'diminish' && !isProductWithoutAmount) {
      // 31 -> 4 = 27;
      const newAmount = oldAmount - amount;

      if (newAmount < 0) {
        return res.status(400).json({
          message: 'Quantidade maior que estoque permitido.',
          isAllowed: false,
        });
      }
      await ProductsRepository.updateAmount({ productId, amount: newAmount });
      return res.json({
        message: 'Quantidade do produto atualizada',
        isAllowed: true,
      });
    }

    if (operation === 'increase' && !isProductWithoutAmount) {
      // 27 -> 4 = 31
      const newAmount = oldAmount + amount;
      await ProductsRepository.updateAmount({ productId, amount: newAmount });
      return res.json({
        message: 'Quantidade do produto atualizada',
        isAllowed: true,
      });
    }

    return res.json({ message: 'Quantidade do produto atualizada' });
  }
}

module.exports = new ProductController();
