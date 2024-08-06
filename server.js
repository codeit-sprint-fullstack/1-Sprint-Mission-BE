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

// 상품 상세 조회
app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).send({ message: '상품을 찾을 수 없습니다.' });
      }
  
      res.status(200).send(product);
    } catch (error) {
      console.error('상품 상세 조회 중 오류 발생:', error);
      res.status(500).send({ error: '상품을 불러오는 데 실패했습니다' });
    }
  });
  
  app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
