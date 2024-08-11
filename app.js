import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));

const app = express();

app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: 'Cannot find given id.' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.get('/products', async (req, res) => {
  const { sort = 'recent', offset = 0, search = '' } = req.query;

  const sortOption = {
    createdAt: sort === 'recent' ? 'desc' : 'asc',
  };

  const searchQuery = {
    $or: [{ name: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }],
  };

  const products = await Product.find(searchQuery).sort(sortOption).skip(Number(offset)).select('_id name price createdAt');

  res.send(products);
});

app.get(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Cannot find given id. ' });
    }
  })
);

app.post(
  '/products',
  asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201).send(newProduct);
  })
);

app.patch(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (product) {
      Object.keys(req.body).forEach((key) => {
        product[key] = req.body[key];
      });
      await product.save();
      res.send(product);
    } else {
      res.status(404).send({ message: 'Cannot find given id. ' });
    }
  })
);

app.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: 'Cannot find given id. ' });
    }
  })
);

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
