import express from 'express';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

// const corsOptions = {
//   origin: ['http://127.0.0.1:5500', 'https://my-todo.com'],
// };

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

//전체조회, 페이지사이즈별로 조회, 키워드조회
app.get(
  '/products',
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const orderBy = req.query.orderBy || 'recent';
    const keyword = req.query.keyword
      ? req.query.keyword.replace(/"/g, '')
      : '';

    console.log('pageSize:', pageSize);
    console.log('orderBy:', orderBy);

    const orderByOption =
      orderBy === 'favorite'
        ? { favoriteCount: -1 } // 내림차순 정렬
        : { createdAt: -1 }; // 기본값으로 최신순 정렬

    const searchCondition = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
          ],
        }
      : {};

    console.log('keyword:', searchCondition);

    const totalCount = await Product.countDocuments(searchCondition);

    const products = await Product.find(searchCondition)
      .sort(orderByOption)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      totalCount,
      products,
    });
  })
);

// 상품 상세 조회
// app.get(
//   '/products/:id',
//   asyncHandler(async (req, res) => {
//     const id = req.params._id;
//     const task = await Product.findById(id);

//     if (task) {
//       res.send(task);
//     } else {
//       res.status(404).send({ message: `아이디 ㄴㄴ ㅠㅠ` });
//     }
//   })
// );

app.post(
  '/products',
  asyncHandler(async (req, res) => {
    // const newProduct = await Product.create(req.body);
    // res.status(201).send(newProduct);

    const { name, description, price, tags, images } = req.body;

    const newProduct = await Product.create({
      name,
      description,
      price,
      tags,
      images,
    });
    res.json({ Product: newProduct });
  })
);

// app.patch(
//   '/products/:id',
//   asyncHandler(async (req, res) => {
//     const id = req.params.id;
//     const task = await Product.findById(id);
//     if (task) {
//       Object.keys(req.body).forEach((key) => {
//         task[key] = req.body[key];
//       });
//       await task.save();
//       res.send(task);
//     } else {
//       res.status(404).send({ message: `아이디 ㄴㄴ ㅠㅠ` });
//     }
//   })
// );

// app.delete(
//   '/products/:id',
//   asyncHandler(async (req, res) => {
//     const id = req.params.id;
//     const task = await Product.findByIdAndDelete(id);
//     if (task) {
//       res.sendStatus(204);
//     } else {
//       res.status(404).send({ message: `아이디 ㄴㄴ ㅠㅠ` });
//     }
//   })
// );

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
