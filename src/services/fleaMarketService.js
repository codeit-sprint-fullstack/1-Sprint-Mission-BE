import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Flea Market 게시물 목록 가져오기
export const getFleaMarket = async (page, limit, keyword, sort, userId) => {
  const offset = (page - 1) * limit;

  let orderBy;
  if (sort === 'recent') {
    orderBy = [{ createdAt: 'desc' }, { id: 'desc' }];
  } else {
    orderBy = [
      { favoriteCount: 'desc' },
      { createdAt: 'desc' },
      { id: 'desc' },
    ];
  }

  const articles = await prisma.fleaMarket.findMany({
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
    take: Number(limit),
  });

  const articlesWithIsLiked = articles.map((article) => {
    const isLiked = userId
      ? article.favorite.some((fav) => fav.userId === userId)
      : false;
    return {
      ...article,
      isLiked, // isLiked 필드 추가
    };
  });

  const total = await prisma.fleaMarket.count({
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
    data: articlesWithIsLiked,
  };
};

// Flea Market 게시물 상세 가져오기
export const getFleaMarketDetail = async (id, userId) => {
  const article = await prisma.fleaMarket.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: true,
      favorite: true,
    },
  });

  const isLiked = userId
    ? article.favorite.some((fav) => fav.userId === userId)
    : false;

  if (!article) {
    const error = new Error('게시물이 존재하지 않습니다');
    error.code = 404;
    error.status = 404;
    throw error;
  }

  return { article, isLiked };
};

// Flea Market 게시물 삭제
export const deleteFleaMarket = async (id) => {
  await prisma.fleaMarket.delete({
    where: {
      id: Number(id),
    },
  });
};

// Flea Market 게시물 생성
export const postFleaMarket = async (price, title, content, tags, req) => {
  const imagePaths = req.files ? req.files.map((file) => file.path) : [];
  const tagsArray = tags ? tags.split(',') : [];

  const article = await prisma.fleaMarket.create({
    data: {
      title,
      content,
      price: Number(price),
      tags: tagsArray,
      images: imagePaths,
    },
  });

  return article; // 게시물 반환
};

// Flea Market 게시물 수정
export const editFleaMarket = async (price, title, content, tags, id, req) => {
  const imagePaths = req.files ? req.files.map((file) => file.path) : []; // 이미지 경로 처리
  const tagsArray = tags ? tags.split(',') : []; // 태그 배열로 변환

  const article = await prisma.fleaMarket.update({
    where: { id: Number(id) },
    data: {
      title,
      content,
      price: Number(price),
      tags: tagsArray,
      images: imagePaths,
    },
  });

  return article; // 수정된 게시물 반환
};
