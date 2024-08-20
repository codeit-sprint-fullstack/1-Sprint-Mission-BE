import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
const prisma = new PrismaClient();

const app = express();
app.use(express.json());
 

//게시글 생성
app.post('/article', async (req, res) => {
  const article = await prisma.article.create({
    data: req.body,
    select: {
      title: true,
      content: true,
      likes: true,
      img: true,
      createdAt: true,
      userId: true
    }
  });

  res.status(201).send(article);
});

//게시글 조회
app.get('/article/:id', async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: { id },
    select: { 
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  })
  res.send(article);
});

//게시글 수정
app.patch('/article/:id', async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.update({
    where: { id },
    data: req.body, 
    select: { 
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });
 
  res.send(article);
});

//상세 스터디 삭제
app.delete('/article/:id', async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.delete({
    where: { id },
    select: { id: true }
  });

   res.status(200).send(article);
})

//게시판 목록 조회
app.get('/article/', async (req, res) => {
  const { offset = 0, limit = 6, order = "newest", search = "" } = req.query;
  let orderBy;
  switch (order) {
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;  
    case 'mostLikes':
      orderBy = { point: 'desc' };
      break;
  }
  const articles = await prisma.article.findMany({
    where: {
      OR: [{title: { contains: search }}, {content: { contains: search }}]
    },
    orderBy,
    skip: parseInt(offset),
    take: parseInt(limit),
    select: {
      id: true,
      title: true,
      likes: true,
      img: true,
      createdAt: true,
      userId: true,
    }
  });
  res.send(articles);
});
 
 
//댓글 생성
app.post('/article/:id/comment', async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const data = {
    content: body.content,
    userId: body.userId,
    articleId: id
  };

  const comment = await prisma.comment.create({
    data: data,
    select: { 
      id: true,
      content: true,
      createdAt: true,
      userId: true,
      articleId: true,
    },
  });

  res.status(201).send(comment);
});

//댓글 수정
app.patch('/comment/:id', async (req, res) => {
  const { id } = req.params;
  const comment = await prisma.comment.update({
    where: { id },
    data: req.body, 
    select: { 
      id: true,
      content: true,
      createdAt: true,
      userId: true,
      articleId: true,
    },
  });

  res.send(comment);
});

//댓글 삭제
app.delete('/comment/:id', async (req, res) => {
  const { id } = req.params;
  const comment = await prisma.comment.delete({
    where: { id },
    select: { id: true }
  });

   res.status(200).send(comment);
})

//댓글 목록 조회
app.get('/article/:id/comment', async (req, res) => {
  const { id } = req.params;
  const comment = await prisma.comment.findMany({
    where: { articleId: id },
    select: {
      id: true,
      content: true,
      userId: true,
      articleId:true,
    }
  })

  res.send(comment);
});
 
app.listen(3000, () => console.log('server started'));