import prisma from "../config/prisma.js";

async function getAll({ articleId, limit, productId, lastId }) {
  const queryOptions = {
    where: {},
    take: limit,
    skip: lastId ? 1 : 0,
    cursor: lastId ? { id: lastId } : undefined,
    select: {
      id: true,
      content: true,
      createdAt: true,
      updatedAt: true,
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

async function create({ productId, articleId, userId, data }) {
  const queryOptions = {
    data: {
      ...data,
      user: { connect: { id: userId } },
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

async function updateById(id, data) {
  const updatedArticle = await prisma.comment.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });
  return updatedArticle;
}

async function deleteById(id) {
  const deletedComment = await prisma.comment.delete({ where: { id } });
  return deletedComment;
}

export default {
  getAll,
  create,
  updateById,
  deleteById,
};
