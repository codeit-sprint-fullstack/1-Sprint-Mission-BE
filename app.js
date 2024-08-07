import express from 'express';
import mongoose from 'mongoose';
import { DATABASE_URL } from './env.js';
import Product from './models/Product.js';

mongoose.connect(DATABASE_URL).then(() => console.log('Connected to DB!!'));

const app = express();
app.use(express.json());

// 상품 등록 API
app.post('/products', async (req, res) => {
  const newProduct = await Product.create(req.body);
  res.status(201).send(newProduct);
});

// 상품 상세 조회 API
app.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);

  if (product) {
    // 응답에 필요한 필드만 선택해서 보냄
    res.send({
      id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      createdAt: product.createdAt,
    });
  } else {
    res.status(404).send({ message: 'Cannot find given id.' });
  }
});

// 상품 수정 API
app.patch('/products/:id', async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id);
  if (product) {
    Object.keys(req.body).forEach((key) => {
      product[key] = req.body[key];
    });
    await product.save();
    res.send(product);
  } else {
    res.status(404).send({ message: 'Cannot find give id.' });
  }
});

app.listen(3000, () => console.log('Sever started!!'));
