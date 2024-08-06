import dotenv from 'dotenv';
dotenv.config(); // 환경 변수 설정

import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

console.log('Database_URL:', process.env.DATABASE_URL);

// MongoDB 연결
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
