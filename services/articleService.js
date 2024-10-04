import prisma from "../models/index.js";

// 상품 생성 서비스 함수
export const createArticle = async (image, content, title, userId) => {
  const newArticle = await prisma.article.create({
    data: {
      image,
      content,
      title,
      userId,
    },
    include: {
      writer: true,
    },
  });

  return newArticle;
};

export const getArticles = async (
  page = 1,
  pageSize = 10,
  keyword = "",
  orderBy = "recent"
) => {
  const offset = (page - 1) * pageSize;

  // 키워드 검색 조건 설정
  const whereCondition = keyword
    ? {
        OR: [
          { name: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  // 정렬 조건 설정
  let orderCondition;
  if (orderBy === "favorite") {
    orderCondition = { LikeCount: "desc" };
  } else {
    orderCondition = { createdAt: "desc" };
  }

  const [list, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where: whereCondition,
      skip: offset,
      take: pageSize,
      orderBy: orderCondition,
      include: {
        writer: true,
      },
    }),
    prisma.article.count({
      where: whereCondition,
    }),
  ]);

  return { list, totalCount, page, pageSize };
};

export const getArticleById = async (articleId) => {
  return prisma.article.findUnique({
    where: { id: parseInt(articleId) },
    include: {
      writer: true,
    },
  });
};

export const updateArticle = async (articleId, image, title, content) => {
  const updatedArticle = await prisma.article.update({
    where: { id: parseInt(articleId) },
    data: {
      image: image,
      title: title,
      content: content,
    },
  });

  return updatedArticle;
};

export const deleteArticle = async (articleId) => {
  await prisma.article.delete({ where: { id: parseInt(articleId) } });
};

export const addLike = async (articleId) => {
  const addLike = await prisma.$transaction([
    prisma.article.update({
      where: { id: parseInt(articleId) },
      data: {
        likeCount: { increment: 1 },
        isLike: true,
      },
    }),
  ]);
  return addLike;
};

export const deleteLike = async (articleId) => {
  const deleteLike = await prisma.$transaction([
    prisma.article.update({
      where: { id: parseInt(articleId) },
      data: {
        likeCount: { decrement: 1 },
        isLike: false,
      },
    }),
  ]);
  return deleteLike;
};
