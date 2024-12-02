import { PrismaClient } from '@prisma/client';

export interface CommentsValues {
  cursor: string | undefined;
  limit: string | undefined;
  articleId: string;
  articleCategory: string;
}

interface CommentsReturn {
  totalCount: number;
  comments: {
    id: number;
    content: string;
    createdAt: Date;
    updatedAt: Date | null;
    userId: string | null;
    freeBoardId: number | null;
    fleaMarketId: number | null;
    user: {
      nickname: string | null;
      image: string[];
    } | null;
  }[];
}

interface commentValues {
  articleId: string;
  articleCategory: string;
  content: string;
  userId: string | undefined;
}

const prisma = new PrismaClient();

export const getComments = async ({
  cursor = '',
  limit = '5',
  articleId,
  articleCategory,
}: CommentsValues): Promise<CommentsReturn> => {
  if (!articleId) {
    throw new Error('articleId is required'); // articleId가 없으면 에러를 던집니다.
  }

  const commentData = getCommentData(articleCategory, articleId);
  const numericLimit = limit ? Number(limit) : 5;
  const cursorValue = cursor ? Number(cursor) : null;

  const comments = await prisma.comment.findMany({
    take: numericLimit,
    ...(cursorValue && { cursor: { id: cursorValue } }),
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    where: {
      ...commentData,
    },
    include: {
      user: {
        select: {
          nickname: true,
          image: true,
        },
      },
    },
  });

  const totalCount = await prisma.comment.count({
    where: {
      ...commentData,
    },
  });

  return { totalCount, comments };
};

export const postComment = async ({
  articleId,
  articleCategory,
  content,
  userId,
}: commentValues) => {
  if (!articleId) {
    throw new Error('articleId is required'); // articleId가 없으면 에러를 던집니다.
  }

  const commentData = getCommentData(articleCategory, articleId);

  const comments = await prisma.comment.create({
    data: {
      content: content,
      userId: userId,
      ...commentData,
    },
    include: {
      user: {
        select: {
          nickname: true,
          image: true,
        },
      },
    },
  });

  return comments;
};

export const editComment = async (id: string, content: string) => {
  const comments = await prisma.comment.update({
    where: {
      id: Number(id),
    },
    data: {
      content: content,
    },
    include: {
      user: {
        select: {
          nickname: true,
          image: true,
        },
      },
    },
  });

  return comments;
};

export const deleteComment = async (id: string) => {
  await prisma.comment.delete({
    where: {
      id: Number(id),
    },
  });
};

const getCommentData = (articleCategory: string, articleId: string) => {
  if (articleCategory === 'fleamarket') {
    return { fleaMarketId: Number(articleId) };
  } else {
    return { freeBoardId: Number(articleId) };
  }
};
