const mongoose = require('mongoose');
<<<<<<< HEAD
// const { findByName } = require('../repositories/ProductsRepository');
=======
>>>>>>> 683a39cd768f2f6241787b709d91b9c804d5dd87

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
  },
  imageURL: String,
  category: String,
  unitPrice: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    min: 0,
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
