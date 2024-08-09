import express from 'express';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import cors from 'cors';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

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
    const keyword = req.query.keyword;
    // ? req.query.keyword.replace(/"/g, '')
    // : '';

    const orderByOption =
      orderBy === 'favorite' ? { favoriteCount: -1 } : { createdAt: -1 };

    const searchCondition = keyword
      ? {
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
          ],
        }
      : {};

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
app.get(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    const product = await Product.findById(id);

    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: `Not Found` });
    }
  })
);

// 상품게시
app.post(
  '/products',
  asyncHandler(async (req, res) => {
    const { name, description, price, tags } = req.body;
    // const images = req.files.map((file) => file.path);

    const newProduct = await Product.create({
      name,
      description,
      price,
      tags,
      // images,
    });

    res.json({ Product: newProduct });
  })
);

//상품 수정
app.patch(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { name, description, price, tags } = req.body;

    const product = await Product.findById(id).select(
      'id name description price tags createdAt'
    );

    if (product) {
      Object.keys(req.body).forEach((key) => {
        product[key] = req.body[key];
      });
      await product.save();
      res.send(product);
    } else {
      res.status(404).send({ message: `Not Found` });
    }
  })
);

// 상품 삭제
app.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if (product) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: `Not Found` });
    }
  })
);

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
