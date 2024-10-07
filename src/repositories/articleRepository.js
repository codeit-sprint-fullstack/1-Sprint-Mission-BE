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
  const article = await prisma.article.findUniqueOrThrow({
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

export async function findLikedUser(articleId, userId) {
  const hasLiked = await prisma.article.findFirst({
    where: { id: articleId },
    LikedUsers: { some: { writerId: userId } },
  });

  return hasLiked;
}

export async function updateLike(id, currentLikeCount) {
  const updatedArticle = await prisma.article.update({
    where: {
      id,
      likeCount: currentLikeCount,
    },
    data: {
      likedUsers: { connect: { writerId: userId } },
      likeCount: { increment: 1 },
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

export async function createLikedUser(id, currentLikeCount, option) {
  const updatedArticle = await prisma.article.update({
    where: {
      id,
      likeCount: currentLikeCount,
    },
    data: {
      likedUsers: { connect: { writerId: userId } },
      likeCount: option,
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

export async function deleteLikedUser(id, currentLikeCount, option) {
  const updatedArticle = await prisma.article.update({
    where: {
      id,
      likeCount: currentLikeCount,
    },
    data: {
      likedUsers: { disconnect: { writerId: userId } },
      likeCount: option,
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

export async function findLikeCount(id) {
  const article = await prisma.article.findUnique({
    where: id,
    select: {
      likeCount: true,
    },
  });
  return article;
}
