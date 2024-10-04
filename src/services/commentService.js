import { prisma } from "../utils/prisma.js";

export const createComment = async (data) => {
  return prisma.comment.create({ data });
};

export const getComments = async (productId, page, limit) => {
  const skip = (page - 1) * limit;
  const [comments, totalCount] = await Promise.all([
    prisma.comment.findMany({
      where: { productId: Number(productId) },
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: { user: { select: { id: true, nickname: true } } },
    }),
    prisma.comment.count({ where: { productId: Number(productId) } }),
  ]);

  return { comments, totalCount };
};

export const updateComment = async (id, content) => {
  return prisma.comment.update({
    where: { id: Number(id) },
    data: { content },
  });
};

export const deleteComment = async (id) => {
  return prisma.comment.delete({ where: { id: Number(id) } });
};
