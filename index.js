import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import productRoutesMongoose from './routes/products_mongoose.js';
import productRoutesPrisma from './routes/products_prisma.js';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB 연결 성공'))
.catch((error) => {
  console.error('❌ MongoDB 연결 실패:', error);
  process.exit(1);
});



// Prisma 연결 (PostgreSQL)
prisma.$connect()
  .then(() => console.log('✅ PostgreSQL (Prisma) 연결 성공'))
  .catch((error) => {
    console.error('❌ PostgreSQL (Prisma) 연결 실패:', error);
    process.exit(1);
  });

// API 라우트 설정
app.use('/api/products/mongoose', productRoutesMongoose);
app.use('/api/products/prisma', productRoutesPrisma);

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// 존재하지 않는 경로 처리
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
