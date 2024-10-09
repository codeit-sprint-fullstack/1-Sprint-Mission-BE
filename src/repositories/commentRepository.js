import prisma from '../config/prisma.js';
import { COMMENT_FIELD, OWNER_FIELDS } from '../config/fieldOptions.js';

export async function getAll({ whichEntity, whichId, limit, lastId }) {
  const queryOptions = {
    where: { [whichEntity]: { id: whichId } },
    take: limit,
    skip: lastId ? 1 : 0,
    cursor: lastId ? { id: lastId } : undefined,
    orderBy: { createdAt: 'desc' },
    select: {
      ...COMMENT_FIELD,
      writer: {
        select: {
          ...OWNER_FIELDS,
        },
      },
    },
  };

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

export async function create({ whichId, whichEntity, userId, data }) {
  const newComment = await prisma.comment.create({
    data: {
      ...data,
      writer: { connect: { id: userId } },
      [whichEntity]: { connect: { id: whichId } },
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
