import dotenv from 'dotenv';
dotenv.config(); // 환경 변수 설정

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import productRoutes from './api/products/productRoutes.js';
import articleRoutes from './api/articles/articleRoutes.js';
import boardCommentRoutes from './api/comments/boardCommentRoutes.js';
import marketCommentRoutes from './api/comments/marketCommentRoutes.js';

const app = express();
app.use(express.json());

// cors 설정( 일단, 모든 도메인에서의 요청을 허용해놓음 )
app.use(cors());

// MongoDB 연결
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));


app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
