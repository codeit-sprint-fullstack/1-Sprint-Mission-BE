import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Flea Market 게시물 목록 가져오기
export const getFreeBoard = async (page, limit, keyword, sort, userId) => {
  const offset = (page - 1) * limit;

  let orderBy;
  if (sort === 'recent') {
    orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];
  } else {
    orderBy = [
      { favorite: { _count: 'desc' } },
      { createdAt: 'desc' },
      { id: 'desc' },
    ];
  }

  const articles = await prisma.freeBoard.findMany({
    where: {
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { content: { contains: keyword, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
    include: {
      user: true,
      comment: true,
      favorite: true,
    },
    orderBy,
    skip: offset,
    take: parseInt(limit, 10),
  });

  const total = await prisma.freeBoard.count({
    where: {
      ...(keyword
        ? {
            OR: [
              { title: { contains: keyword, mode: 'insensitive' } },
              { content: { contains: keyword, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
  });

  return {
    total,
    totalPages: Math.ceil(total / limit),
    articles,
  };
};

// Flea Market 게시물 상세 가져오기
export const getFreeBoardDetail = async (id, userId) => {
  const article = await prisma.freeBoard.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: true,
      favorite: true,
    },
  });

  if (!article) {
    const error = new Error('게시물이 존재하지 않습니다');
    error.code = 404;
    error.status = 404;
    throw error;
  }

  return article;
};

// Flea Market 게시물 생성
export const postFreeBoard = async (title, content, tags, userId) => {
  const article = await prisma.freeBoard.create({
    data: {
      title: title,
      content: content,
      tags,
      userId,
    },
  });

  return article; // 게시물 반환
};

// Flea Market 게시물 수정
export const editFreeBoard = async (title, content, id, req) => {
  const article = await prisma.freeBoard.update({
    where: { id: Number(id) },
    data: { title, content },
  });

  return article; // 수정된 게시물 반환
};

// Flea Market 게시물 삭제
export const deleteFreeBoard = async (id) => {
  await prisma.freeBoard.delete({
    where: {
      id: Number(id),
    },
  });
};
