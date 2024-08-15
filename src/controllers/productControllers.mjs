import mongoose from 'mongoose';
import Product from '../models/Product.mjs';

//get products by queries
// query parameter: orderBy, page, pageSize, keyword
export const getProducts = async (req, res) => {
  const { orderBy } = req.query;
  const page = parseInt(req.query.page) * 1 || 1;
  const pageSize = parseInt(req.query.pageSize) * 1 || 10;
  const keyword = req.query.keyword || '';

  const offset = (page - 1) * pageSize;
  const sortOption = { createdAt: orderBy === 'recent' ? 'desc' : 'asc' };

  const searchQuery = {
    $or: [{ name: new RegExp(keyword) }, { description: new RegExp(keyword) }],
  };

  const products = await Product.find(searchQuery)
    .sort(sortOption)
    .limit(pageSize)
    .skip(offset);

  const totalCount = await Product.countDocuments(searchQuery);

  res.send({ totalCount, list: products });
};

//get product by id
export const getProductById = async (req, res) => {
  const { id } = req.params;
  const isValidIdFormat = mongoose.Types.ObjectId.isValid(id);

  if (!isValidIdFormat) {
    return res.status(400).send({ message: 'Invalid ID format.' });
  }

  const product = await Product.findById(
    id,
    '_id name description price tags createdAt'
  );

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
