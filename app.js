import express from 'express';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://127.0.0.1:5500', 'https://my-todo.com'],
};

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to DB'));

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message });
      } else if (e.name === 'CatsError') {
        res.status(404).send({ message: 'Can not find given id' });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

app.get(
  '/products',
  asyncHandler(async (req, res) => {
    const sort = req.query.sort;
    const count = Number(req.query.count) || 0;

    const sortOption = { createdAt: sort === 'oldest' ? 'asc' : 'desc' };
    const products = await Product.find().sort(sortOption).limit(count);

    res.send(products);
  })
);

app.get(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Product.findById(id);
    if (task) {
      res.send(task);
    } else {
      res.status(404).send({ message: `아이디 ㄴㄴ ㅠㅠ` });
    }
  })
);

app.post(
  '/products',
  asyncHandler(async (req, res) => {
    const newTask = await Product.create(req.body);
    res.status(201).send(newTask);
  })
);

app.patch(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Product.findById(id);
    if (task) {
      Object.keys(req.body).forEach((key) => {
        task[key] = req.body[key];
      });
      await task.save();
      res.send(task);
    } else {
      res.status(404).send({ message: `아이디 ㄴㄴ ㅠㅠ` });
    }
  })
);

app.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const task = await Product.findByIdAndDelete(id);
    if (task) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: `아이디 ㄴㄴ ㅠㅠ` });
    }
  })
);

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
