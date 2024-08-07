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

app.listen(3000, () => console.log('Sever started!!'));
