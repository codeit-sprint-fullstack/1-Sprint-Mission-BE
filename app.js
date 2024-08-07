import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import * as dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB!!'));

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
        res.status(404).send({ message: e.message });
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

// 상품 등록 API
app.post(
  '/products',
  asyncHandler(async (req, res) => {
    const newProduct = await Product.create(req.body);
    res.status(201).send(newProduct);
  })
);

// 상품 상세 조회 API
app.get(
  '/products/:id',
  asyncHandler(async (req, res) => {
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
  })
);

// 상품 목록 조회 API
app.get(
  '/products',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sort = '', search = '' } = req.query;

    // 페이지네이션 및 정렬 설정
    const offset = (page - 1) * limit;
    const sortOption = { createdAt: sort === 'recent' ? 'desc' : 'asc' };

    // 검색 조건 설정
    const searchQuery = search
      ? {
          $or: [{ name: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }],
        }
      : {};

    // DB에서 상품 목록 조회
    const products = await Product.find(searchQuery)
      .sort(sortOption)
      .skip(offset)
      .limit(Number(limit))
      .select('id name description price tags images createdAt');

    const totalProducts = await Product.countDocuments(searchQuery);

    res.send({
      total: totalProducts,
      page: parseInt(page),
      limit: parseInt(limit),
      products: products,
    });
  })
);

// 상품 수정 API
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
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

// 상품 삭제 API
app.delete(
  '/products/:id',
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if (product) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: 'Cannot find given id.' });
    }
  })
);

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
