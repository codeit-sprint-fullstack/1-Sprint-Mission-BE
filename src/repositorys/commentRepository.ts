import prismaClient from "../utils/prismaClient";
import { Comment } from "@prisma/client";
import { CommentData } from "../utils/interfaces/comments/commentData";

const getArticleComments = async (
  cursor: string,
  limit: number,
  id: string
): Promise<Comment[]> => {
  return prismaClient.comment.findMany({
    where: { articleId: id },
    take: limit + 1, //추가적인 댓글이 있는지 확인
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createAt: "desc",
    },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const getProductComments = async (
  cursor: string,
  limit: number,
  id: string
): Promise<Comment[]> => {
  return prismaClient.comment.findMany({
    where: { productId: id },
    take: limit + 1, //추가적인 댓글이 있는지 확인
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createAt: "desc",
    },
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const getById = async (id: string): Promise<Comment | null> => {
  return prismaClient.comment.findUnique({
    where: {
      id,
    },
  });
};

const createComment = async (data: CommentData) => {
  return prismaClient.comment.create({
    data,
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const updateComment = async (id: string, data: CommentData) => {
  return prismaClient.comment.update({
    where: {
      id,
    },
    data,
    include: {
      user: {
        select: {
          nickname: true,
        },
      },
    },
  });
};

const deleteComment = async (id: string) => {
  return prismaClient.comment.delete({
    where: {
      id,
    },
  });
};

export default {
  getArticleComments,
  getProductComments,
  getById,
  createComment,
  updateComment,
  deleteComment,
};
