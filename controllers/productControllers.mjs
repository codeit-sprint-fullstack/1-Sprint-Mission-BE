import mongoose from 'mongoose';
import Product from '../models/Product.mjs';

export const getAllProduct = async (req, res) => {
  const sort = req.query.sort;
  const sortOption = { createdAt: sort === 'recent' ? 'desc' : 'asc' };

  const products = await Product.find().sort(sortOption);

  res.send(products);
};

//get product by id
export const getProductById = async (req, res) => {
  const { id } = req.params;
  const isValidIdFormat = mongoose.Types.ObjectId.isValid(id);

  if (!isValidIdFormat) {
    return res.status(400).send({ message: 'Invalid ID format.' });
  }

  const product = await Product.findById(id);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
};

// create new product
export const createProduct = async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).send(newProduct);
};

// patch existed product with id
export const updateProductById = async (req, res) => {
  const { id } = req.params;
  const updateInfo = req.body;
  const isValidIdFormat = mongoose.Types.ObjectId.isValid(id);

  if (!isValidIdFormat) {
    return res.status(400).send({ message: 'Invalid ID format.' });
  }

  const updateProduct = await Product.findByIdAndUpdate(id, updateInfo, {
    new: true,
    runValidators: true,
  });

  if (updateProduct) {
    return res.status(200).send(updateProduct);
  } else {
    return res.status(404).send({ message: 'Cannot find given id.' });
  }
};

// delete a product by id
export const deleteProductById = async (req, res) => {
  const { id } = req.params;
  const isValidIdFormat = mongoose.Types.ObjectId.isValid(id);

  if (!isValidIdFormat) {
    return res.status(400).send({ message: 'Invalid ID format.' });
  }

  const deleteProduct = await Product.findByIdAndDelete(id);

  if (deleteProduct) {
    return res.status(200).send({ message: 'Product deleted successfully.' });
  } else {
    return res.status(404).send({ message: 'Cannot find given id.' });
  }
};
