import prisma from "../models/index";
import { Prisma } from "@prisma/client";

export const parseId = (id: string): number => {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed)) {
    throw new Error("Invalid ID format");
  }
  return parsed;
};

export const getCursorOptions = (cursor: string | null | undefined) => {
  const parsedCursor = parseInt(cursor as string, 10);
  if (!cursor || isNaN(parsedCursor)) return {};
  return {
    cursor: { id: parsedCursor },
    skip: 1,
  };
};

export const getCommentOptions = (
  limit: number,
  cursor: string | "",
  entityId: number,
  entityType: string
): Prisma.CommentFindManyArgs => ({
  take: limit,
  orderBy: { createdAt: "desc" },
  include: { writer: true },
  where: {
    [entityType]: entityId,
  },
  ...getCursorOptions(cursor),
});

const createComment = async (
  content: string,
  userId: number,
  entityId: number,
  entityType: string
) => {
  const data: Prisma.CommentCreateInput = {
    content,
    writer: { connect: { id: userId } },
    [entityType]: { connect: { id: entityId } },
  };

  const newComment = await prisma.comment.create({
    data,
    include: { writer: true },
  });

  return newComment;
};

const getComments = async (
  limit: number,
  cursor: string | "",
  entityId: number,
  entityType: string
) => {
  const queryOptions = getCommentOptions(limit, cursor, entityId, entityType);
  const list = await prisma.comment.findMany(queryOptions);
  const nextCursor = list.length === limit ? list[list.length - 1].id : null;

  return { list, nextCursor };
};

export const createProductComment = async (
  content: string,
  userId: number,
  productId: string
) => {
  return createComment(content, userId, parseId(productId), "product");
};

export const createArticleComment = async (
  content: string,
  userId: number,
  articleId: string
) => {
  return createComment(content, userId, parseId(articleId), "article");
};

export const getProductComments = async (
  limit: number,
  cursor: string | "",
  productId: string
) => {
  return getComments(limit, cursor, parseId(productId), "productId");
};

export const getArticleComments = async (
  limit: number,
  cursor: string | "",
  articleId: string
) => {
  return getComments(limit, cursor, parseId(articleId), "articleId");
};

export const updateComment = async (commentId: string, content: string) => {
  return prisma.comment.update({
    where: { id: parseId(commentId) },
    data: { content },
    include: { writer: true },
  });
};

export const deleteComment = async (commentId: string): Promise<void> => {
  await prisma.comment.delete({ where: { id: parseId(commentId) } });
};
