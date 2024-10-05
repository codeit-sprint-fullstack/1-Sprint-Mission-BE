import prisma from "../models/index.js";

// Helper function to include writer and favorites relation
const includeRelations = (userId) => ({
  writer: true,
  favorites: {
    where: { userId: parseInt(userId) },
    select: { id: true },
  },
});

// Generate where condition based on keyword
const generateWhereCondition = (keyword) => {
  return keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};
};

// Generate order condition based on order type
const generateOrderCondition = (orderBy) => {
  if (orderBy === "favorite") {
    return { likeCount: "desc" };
  }
  return { createdAt: "desc" };
};

// Create new article
export const createArticle = async (image, content, title, userId) => {
  return prisma.article.create({
    data: { image, content, title, userId },
    include: includeRelations(userId),
  });
};

// Get articles list with pagination and keyword filter
export const getArticles = async (
  page = 1,
  pageSize = 10,
  keyword = "",
  orderBy = "recent"
) => {
  const offset = (page - 1) * pageSize;

  const [list, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where: generateWhereCondition(keyword),
      skip: offset,
      take: pageSize,
      orderBy: generateOrderCondition(orderBy),
      include: { writer: true },
    }),
    prisma.article.count({
      where: generateWhereCondition(keyword),
    }),
  ]);

  const listWithLikeStatus = list.map((article) => ({
    ...article,
  }));

  return { list: listWithLikeStatus, totalCount, page, pageSize };
};

// Get specific article by id with like status
export const getArticleById = async (articleId, userId) => {
  const article = await prisma.article.findUnique({
    where: { id: parseInt(articleId) },
    include: includeRelations(userId),
  });

  if (!article) throw new Error("Article not found");
  console.log(article.favorites.length);

  // Check if the user has liked the article
  const isLiked = article.favorites.length > 0;

  return { ...article, isLiked };
};

// Update article by id
export const updateArticle = async (articleId, image, title, content) => {
  return prisma.article.update({
    where: { id: parseInt(articleId) },
    data: { image, title, content },
    include: { writer: true },
  });
};

// Delete article by id
export const deleteArticle = async (articleId) => {
  await prisma.article.delete({ where: { id: parseInt(articleId) } });
};

// Add like to article
export const addLike = async (articleId, userId) => {
  await prisma.favorite.create({
    data: { articleId: parseInt(articleId), userId: parseInt(userId) },
  });

  return prisma.article.update({
    where: { id: parseInt(articleId) },
    data: {
      likeCount: { increment: 1 },
    },
    include: includeRelations(userId),
  });
};

// Delete like from article
export const deleteLike = async (articleId, userId) => {
  await prisma.favorite.deleteMany({
    where: { articleId: parseInt(articleId), userId: parseInt(userId) },
  });

  return prisma.article.update({
    where: { id: parseInt(articleId) },
    data: {
      likeCount: { decrement: 1 },
    },
    include: includeRelations(userId),
  });
};
