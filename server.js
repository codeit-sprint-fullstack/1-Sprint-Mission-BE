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

// 상품 목록 조회
app.get('/api/products', async (req, res) => {
    const { sort = 'recent', offset = 0, limit = 5, search = '' } = req.query;
  
    try {
      // 정렬 옵션 설정
      const sortOption = sort === 'recent' ? { createdAt: -1 } : {}; // 1은 오름차순, -1 내림차순
  
      // 검색 조건 설정
      const searchQuery = {
        $or: [ // 두 가지 조건 중 하나라도 만족하는 문서를 찾도록 설정
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
  
      // 페이지네이션 및 검색 적용
      const products = await Product.find(searchQuery) 
                                    .sort(sortOption) 
                                    .skip(Number(offset))
                                    .limit(Number(limit)) // 최대 limit 만큼 반환
                                    .select('id name price createdAt'); //선택한 필드만 포함된 결과를 반환
      res.status(200).send(products);
    } catch (error) {
      console.error('상품 목록 조회 중 오류 발생:', error);
      res.status(500).send({ error: '상품 목록을 불러오는 데 실패했습니다' });
    }
  });

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
