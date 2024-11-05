import prisma from "../models/index.js";
import { Prisma } from "@prisma/client";

interface Article {
  id: number;
  title: string;
  content: string;
  images: string[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  writer: User;
  favorites: Favorite[];
  isLiked?: boolean;
}

interface User {
  id: number;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Favorite {
  id: number;
  userId: number;
  articleId: number;
}
const includeRelations = (userId: number) => ({
  writer: true,
  favorites: {
    where: { userId: userId },
    select: { id: true, userId: true, articleId: true }, // favorites의 전체 필드를 선택하도록 수정
  },
});

const generateWhereCondition = (keyword: string): Prisma.ArticleWhereInput => {
  return keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};
};

const generateOrderCondition = (
  orderBy: string
): Prisma.Enumerable<Prisma.ArticleOrderByWithRelationInput> => {
  if (orderBy === "favorite") {
    return [{ likeCount: "desc" }, { createdAt: "desc" }];
  }
  return { createdAt: "desc" };
};

export const getArticles = async (
  page: number = 1,
  pageSize: number = 10,
  keyword: string = "",
  orderBy: string = "recent"
): Promise<{
  list: Article[];
  totalCount: number;
  page: number;
  pageSize: number;
}> => {
  const offset = (page - 1) * pageSize;

  const [list, totalCount] = await prisma.$transaction([
    prisma.article.findMany({
      where: generateWhereCondition(keyword),
      skip: offset,
      take: pageSize,
      orderBy: generateOrderCondition(orderBy),
      include: {
        writer: true,
        favorites: true, // Include all favorite fields
      },
    }),
    prisma.article.count({
      where: generateWhereCondition(keyword),
    }),
  ]);

  const listWithLikeStatus = list.map((article) => ({
    ...article,
    favorites: article.favorites.map((fav) => ({
      id: fav.id,
      userId: fav.userId,
      articleId: fav.articleId,
    })),
  })) as Article[];

  return { list: listWithLikeStatus, totalCount, page, pageSize };
};

export const createArticle = async (
  images: string[],
  content: string,
  title: string,
  userId: number
): Promise<Article> => {
  const newArticle = await prisma.article.create({
    data: { images, content, title, userId },
    include: includeRelations(userId),
  });

  // 수동으로 Article 타입에 맞도록 매핑 (favorites가 부족한 경우 대응)
  return {
    ...newArticle,
    favorites: newArticle.favorites.map((fav) => ({
      id: fav.id,
      userId: userId,
      articleId: newArticle.id,
    })),
  } as Article;
};

export const getArticleById = async (
  articleId: number,
  userId: number
): Promise<Article> => {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: includeRelations(userId),
  });

  if (!article) throw new Error("Article not found");

  const isLiked = article.favorites.length > 0;

  return {
    ...article,
    favorites: article.favorites.map((fav) => ({
      id: fav.id,
      userId: fav.userId,
      articleId: fav.articleId,
    })),
    isLiked,
  } as Article;
};

export const updateArticle = async (
  articleId: number,
  userId: number,
  images: string[],
  title: string,
  content: string
): Promise<Article> => {
  const updatedArticle = await prisma.article.update({
    where: { id: articleId },
    data: { images, title, content },
    include: includeRelations(userId),
  });

  return {
    ...updatedArticle,
    favorites: updatedArticle.favorites.map((fav) => ({
      id: fav.id,
      userId: fav.userId,
      articleId: fav.articleId,
    })),
  } as Article;
};

export const deleteArticle = async (articleId: number): Promise<void> => {
  await prisma.article.delete({
    where: { id: articleId },
  });
};

export const addLike = async (
  articleId: number,
  userId: number
): Promise<Article> => {
  await prisma.favorite.create({
    data: {
      articleId: articleId,
      userId: userId,
    },
  });

  return prisma.article.update({
    where: { id: articleId },
    data: {
      likeCount: { increment: 1 },
    },
    include: includeRelations(userId),
  }) as Promise<Article>;
};

export const deleteLike = async (
  articleId: number,
  userId: number
): Promise<Article> => {
  await prisma.favorite.deleteMany({
    where: {
      articleId: articleId,
      userId: userId,
    },
  });

  return prisma.article.update({
    where: { id: articleId },
    data: {
      likeCount: { decrement: 1 },
    },
    include: includeRelations(userId),
  }) as Promise<Article>;
};
