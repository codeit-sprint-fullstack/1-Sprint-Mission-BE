const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// 상품 등록 API
router.post('/products', async (req, res) => {
  try {
    const { name, description, price, tags } = req.body;
    const product = new Product({ name, description, price, tags });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 상품 목록 조회 API
router.get('/products', async (req, res) => {
  try {
    const { orderBy, page = 1, pageSize = 10, keyword = '' } = req.query;
    const sort = orderBy === 'recent' ? { createdAt: -1 } : {};
    const query = { name: new RegExp(keyword, 'i') };

    const products = await Product.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize, 10));

    res.status(200).json({ list: products });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 상품 상세 조회 API
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 상품 수정 API
router.patch('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 상품 삭제 API
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

