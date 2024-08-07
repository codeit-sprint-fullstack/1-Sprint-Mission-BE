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

  if (isValidIdFormat) {
    const product = await Product.findById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  } else {
    res.status(400).send({ message: 'Invalid ID format.' });
  }
};

// create new product
export const createProduct = async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).send(newProduct);
};

// patch existed product with id
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const isValidIdFormat = mongoose.Types.ObjectId.isValid(id);

  if (isValidIdFormat) {
    const product = await Product.findById(id);

    if (product) {
      Object.keys(req.body).forEach((key) => {
        product[key] = req.body[key];
      });

      await product.save();
      return res.send(product);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  } else {
    res.status(400).send({ message: 'Invalid Id format.' });
  }
};
