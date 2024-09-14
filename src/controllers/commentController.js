import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";

import { CreateComment, PatchComment, Uuid } from "../validation/structs.js";

const prisma = new PrismaClient();

// get the product comments list
// route /products/:id/comments
export const getProductComments = async (req, res) => {
  const { id: productId } = req.params;
  assert(productId, Uuid);
  const { limit = 5, cursor: lastId } = req.query;

  const queryOptions = {
    where: { productId },
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

  const comments = await prisma.comment.findMany(queryOptions);

  const nextCursor =
    comments.length === limit ? comments[comments.length - 1].id : null;

  res.status(200).send({ nextCursor, list: comments });
};

// get the article comments list
// route /articles/:id/comments
export const getArticleComments = async (req, res) => {
  const { id: articleId } = req.params;
  assert(articleId, Uuid);
  const { limit = 5, cursor: lastId } = req.query;

  const queryOptions = {
    where: { articleId },
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

  const comments = await prisma.comment.findMany(queryOptions);

  const nextCursor =
    comments.length === limit ? comments[comments.length - 1].id : null;

  res.status(200).send({ nextCursor, list: comments });
};

//create comment on product
//route /products/:id/comments
export const createProductComment = async (req, res) => {
  const { id: productId } = req.params;
  assert(productId, Uuid);
  assert(req.body, CreateComment);

  const { content } = req.body;

  const comment = await prisma.comment.create({
    data: {
      content,
      product: { connect: { id: productId } },
    },
  });
  res.status(201).send(comment);
};

//create comment on article
//route /articles/:id/comments
export const createArticleComment = async (req, res) => {
  const { id: articleId } = req.params;
  assert(articleId, Uuid);
  assert(req.body, CreateComment);

  const { content } = req.body;

  const comment = await prisma.comment.create({
    data: {
      content,
      article: { connect: { id: articleId } },
    },
  });
  res.status(201).send(comment);
};

// patch existed comment with comment id
//route comments/:id
export const updateCommentById = async (req, res) => {
  const { id } = req.params;
  assert(id, Uuid);
  assert(req.body, PatchComment);

  const comment = await prisma.comment.update({
    where: { id },
    data: req.body,
  });
  res.send(comment);
};

// delete a comment by comment id
//route comments/:id
export const deleteCommentById = async (req, res) => {
  const { id } = req.params;
  assert(id, Uuid);

  await prisma.comment.delete({ where: { id } });

  res.status(200).send({ message: "Comment has deleted successfully" });
};
