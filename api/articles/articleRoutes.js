import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router(); // API 경로 정의

// 게시글 목록 조회 API
router.get('/api/articles', async (req, res) => {
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
  router.get('/api/articles/:id', async (req, res) => {
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
  router.post('/api/articles', async (req, res) => {
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
  router.patch('/api/articles/:id', async (req, res) => {
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
  router.delete('/api/articles/:id', async (req, res) => {
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

export default router;