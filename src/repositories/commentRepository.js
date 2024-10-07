import prisma from "../config/prisma.js";
import { COMMENT_FIELD, OWNER_FIELDS } from "../config/fieldOptions.js";

export async function getAll({ articleId, limit, productId, lastId }) {
  const queryOptions = {
    where: {},
    take: limit,
    skip: lastId ? 1 : 0,
    cursor: lastId ? { id: lastId } : undefined,
    orderBy: { createdAt: "desc" },
    select: {
      ...COMMENT_FIELD,
      writer: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  };

  if (articleId) {
    queryOptions.where.articleId = { articleId };
  }
  if (productId) {
    queryOptions.where.productId = { productId };
  }
  const comments = await prisma.comment.findMany(queryOptions);
  return comments;
}

export async function getCommentById(id) {
  const comment = await prisma.comment.findUnique({
    where: {
      id,
    },
    select: {
      ...COMMENT_FIELD,
      writer: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  });

  return comment;
}

export async function create({ productId, articleId, userId, data }) {
  const queryOptions = {
    data: {
      ...data,
      user: { connect: { id: userId } },
    },
    select: {
      ...COMMENT_FIELD,
      writer: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  };

  if (articleId) {
    queryOptions.data.article = { connect: { id: articleId } };
  }
  if (productId) {
    queryOptions.data.product = { connect: { id: productId } };
  }
  const newComment = await prisma.comment.create(queryOptions);
  return newComment;
}

export async function updateById(id, data) {
  const updatedArticle = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
    select: {
      ...COMMENT_FIELD,
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
  await prisma.comment.delete({ where: { id } });
}
