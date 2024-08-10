import dotenv from 'dotenv';
dotenv.config(); // 환경 변수 설정

import express from 'express';
import mongoose from 'mongoose';
import Product from './models/Product.js';
import cors from 'cors';
import { PrismaClient } from '@prisma/client'; // Prisma 클라이언트 설정

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// cors 설정( 일단, 모든 도메인에서의 요청을 허용해놓음 )
app.use(cors());

// MongoDB 연결
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// 상품 목록 조회
app.get('/api/products', async (req, res) => {
    const { sort = 'recent', offset = 0, limit = 10, search = '' } = req.query;
  
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

// 상품 등록
app.post('/api/products', async (req, res) => {
    const { name, description, price, tags } = req.body;
  
    // 데이터 검증
    if (!name || !description || !price) {
      return res.status(400).send({ error: '상품 이름과 설명, 판매가격은 필수로 적어주세요.' });
    }
  
    try {
      const newProduct = new Product({
        name,
        description,
        price: Number(price),
        tags,
      });
  
      await newProduct.save();
      res.status(201).send(newProduct);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

// 상품 수정 API
app.patch('/api/products/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      // 상품을 찾고 업데이트
      const product = await Product.findByIdAndUpdate(id, req.body, 
        {
        new: true, 
        runValidators: true, // 유효성 검사
      });
  
      if (!product) {
        return res.status(404).send({ message: '상품을 찾을 수 없습니다.' });
      }
  
      res.status(200).send(product);
    } catch (error) {
      console.error('상품 수정 중 오류 발생:', error);
      res.status(500).send({ error: '상품을 수정하는 데 실패했습니다' });
    }
  });  

// 상품 삭제 API
app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params; // 수정된 부분: ID를 문자열로 사용
  
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        return res.status(404).send({ message: '상품을 찾을 수 없습니다.' });
      }
  
      res.status(200).send({ message: '상품이 성공적으로 삭제되었습니다.' });
    } catch (error) {
      console.error('상품 삭제 중 오류 발생:', error);
      res.status(500).send({ error: '상품을 삭제하는 데 실패했습니다' });
    }
  });

/*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ미션 7 게시글 APIㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/

// 게시글 목록 조회 API
app.get('/api/articles', async (req, res) => {
  const { sort = 'recent', offset = 0, limit = 10, search = '' } = req.query;

  try {
    // 정렬 옵션 설정(최신순)
    const orderBy = sort === 'recent' ? { createdAt: 'desc' } : {};

    // 검색 조건 설정
    const where = search
    ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { content: { contains: search, mode: 'insensitive' } }
        ]
      }
    : {};

    // 페이지네이션 및 검색 적용
    const articles = await prisma.article.findMany({
      where,
      orderBy,
      skip: Number(offset),
      take: Number(limit),
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      }
    });

    res.status(200).send(articles);
  } catch (error) {
    console.error('게시글 목록 조회 중 오류 발생:', error);
    res.status(500).send({ error: '게시글 목록을 불러오는 데 실패했습니다.' });
  }
});

// 게시글 상세 조회 API
app.get('/api/articles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (!article) {
      return res.status(404).send({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).send(article);
  } catch (error) {
    console.error('게시글 상세 조회 중 오류 발생:', error);
    res.status(500).send({ error: '게시글을 불러오는 데 실패했습니다.' });
  }
});

// 게시글 등록 API
app.post('/api/articles', async (req, res) => {
  const { title, content } = req.body;

  // 데이터 검증
  if (!title || !content) {
    return res.status(400).send({ error: '게시글 제목과 내용은 필수로 입력해주세요.' });
  }

  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
      },
    });

    res.status(201).send(newArticle);

  } catch (error) {
    console.error('게시글 등록 중 오류 발생:', error);
    res.status(500).send({ error: '게시글을 등록하는 데 실패했습니다' });
  }
});

// 게시글 수정 API
app.patch('/api/articles/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, likeCount } = req.body;

  try {
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        likeCount,
      },
    });

    if (!updatedArticle) {
      return res.status(404).send({ message: '게시글을 찾을 수 없습니다.' });
    }

    res.status(200).send(updatedArticle);
  } catch (error) {
    console.error('게시글 수정 중 오류 발생:', error);
    res.status(500).send({ error: '게시글을 수정하는 데 실패했습니다.' });
  }
});

// 게시글 삭제 API
app.delete('/api/articles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedArticle = await prisma.article.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).send({ message: '게시글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    //게시글 못 찾을때
    if (!deletedArticle) { 
      return res.status(404).send({ message: '게시글을 찾을 수 없습니다.' });
    }
    
    console.error('게시글 삭제 중 오류 발생:', error);
    res.status(500).send({ error: '게시글을 삭제하는 데 실패했습니다.' });
  }
});

/*ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ미션 7 자유게시판 댓글 APIㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ*/

// 자유게시판 댓글 목록 조회 API
app.get('/api/board/comments', async (req, res) => {
  const { cursor = '', limit = 20 } = req.query;

  try {
    // cursor가 있는 경우, cursor보다 큰 id를 가진 댓글을 가져옴
    let query = cursor ? { id: { gt: parseInt(cursor) } } : {};

    const comments = await prisma.comment.findMany({
      where: {
        ...query,
      },
      orderBy: { id: 'asc' }, // id를 기준으로 오름차순 정렬
      take: Number(limit),
      select: { id: true, content: true, createdAt: true, postId: true}
    });

    res.status(200).send(comments);
  } catch (error) {
    console.error('댓글 목록 조회 중 오류 발생:', error);
    res.status(500).send({ error: '댓글 목록을 불러오는 데 실패했습니다.' });
  }
});

// 자유게시판 댓글 등록 API
app.post('/api/board/comments', async (req, res) => {
  const { content, postId } = req.body;

  // 데이터 검증
  if (!content || !postId) {
    return res.status(400).send({ error: '댓글 내용을 입력해주세요.' });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId, 
      },
    });

    res.status(201).send(newComment);
  } catch (error) {
    console.error('댓글 등록 중 오류 발생:', error);
    res.status(500).send({ error: '댓글 등록을 실패했습니다.' });
  }
});

app.patch('/api/comments/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).send({ error: '댓글 내용을 입력해주세요.' });
  }

  try {
    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(id) },
      data: { content },
    });

    res.status(200).send(updatedComment);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).send({ message: '댓글을 찾을 수 없습니다.' });
    }

    console.error('댓글 수정 중 오류 발생:', error);
    res.status(500).send({ error: '댓글 수정을 실패했습니다.' });
  }
});

// 자유게시판 댓글 삭제 API
app.delete('/api/comments/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await prisma.comment.deleteMany({
      where: { 
        id: parseInt(id),
      },
    });

    if (deletedComment.count === 0) {
      return res.status(404).send({ message: '댓글을 찾을 수 없습니다.' });
    }

    res.status(200).send({ message: '댓글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('댓글 삭제 중 오류 발생:', error);
    res.status(500).send({ error: '댓글 삭제를 실패했습니다.' });
  }
});



app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
