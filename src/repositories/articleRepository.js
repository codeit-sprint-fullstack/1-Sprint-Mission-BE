import prisma from "../config/prisma.js";
import { ARTICLE_FIELDS, OWNER_FIELDS } from "../config/fieldOptions.js";

export async function getAll({ searchQuery, sortOption, offset, pageSize }) {
  const articles = await prisma.article.findMany({
    where: searchQuery,
    orderBy: sortOption,
    skip: offset,
    take: pageSize,
    select: {
      ...ARTICLE_FIELDS,
      writer: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  });

  return articles;
}

export async function getTotalCount(searchQuery) {
  const totalCount = await prisma.article.count({ where: searchQuery });
  return totalCount;
}

export async function getArticleById(id) {
  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      ...ARTICLE_FIELDS,
      writer: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  });

  return article;
}

export async function create(userId, data) {
  const newArticle = await prisma.article.create({
    data: {
      ...data,
      writer: {
        connect: { id: userId },
      },
    },
    select: {
      ...ARTICLE_FIELDS,
      writer: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  });
  return newArticle;
}

export async function updateById(id, data) {
  const updatedArticle = await prisma.article.update({
    where: { id },
    data: {
      ...data,
    },
    select: {
      ...ARTICLE_FIELDS,
      writer: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  });
  return updatedArticle;
}

export async function deleteById(id) {
  return await prisma.article.delete({ where: { id } });
}

export async function findLikedUser(tx, { articleId, userId }) {
  const hasUserLiked = await tx.article.findFirst({
    where: {
      id: articleId,
      likedUsers: { some: { id: userId } },
    },
  });

  return hasUserLiked;
}

export async function findLikeCount(tx, articleId) {
  const article = await tx.article.findUnique({
    where: { id: articleId },
    select: {
      likeCount: true,
    },
  });

  return article;
}

export async function updateLikeStatus(
  tx,
  { articleId, currentLikeCount, userId, updateOption }
) {
  const updatedArticle = await tx.article.update({
    where: {
      id: articleId,
      likeCount: currentLikeCount,
    },
    data: {
      likedUsers: { [updateOption]: { id: userId } },
      likeCount:
        updateOption === "connect" ? { increment: 1 } : { decrement: 1 },
    },
    select: {
      ...ARTICLE_FIELDS,
      writer: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  });
  return updatedArticle;
}
