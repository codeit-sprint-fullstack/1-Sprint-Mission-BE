import express from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandle } from "../errorUtils.js";
import { assert } from "superstruct";
import { createComment, updateComment } from "../structs/commentStruct.js";
const app = express.Router();
const prisma = new PrismaClient();

const getComments = async (cursor, limit) => {
  const data = await prisma.comment.findMany({
    where: { articleId: id },
    take: limit + 1, //추가적인 댓글이 있는지 확인
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: {
      createAt: "asc",
    },
  });
  return data;
};

app.get(
  "/:id",
  asyncHandle(async (req, res) => {
    const { limit = 5, cursor = "" } = req.query;
    const { id } = req.params;

    const comments = await getComments(cursor, limit);

    const nextComments = comments.length > limit;
    const nextCursor = nextComments ? comments[limit].id : null;

    const returnData = {
      comments: comments.slice(0, limit),
      Cursor: nextCursor,
    };

    if (comments) {
      res.send(returnData);
    } else {
      res.status(404).send({ message: "댓글을 찾을수 없습니다." });
    }
  })
);

app.post(
  "/",
  asyncHandle(async (req, res) => {
    assert(req.body, createComment);
    const data = await prisma.comment.create({
      data: req.body,
      include: {
        user: true,
      },
    });
    res.send(data);
  })
);

app.patch(
  "/:id",
  asyncHandle(async (req, res) => {
    const { id } = req.params;
    assert(req.body, updateComment);
    const data = await prisma.comment.update({
      where: { id },
      data: req.body,
      include: {
        user: true,
      },
    });
    res.send(data);
  })
);

app.delete(
  "/:id",
  asyncHandle(async (req, res) => {
    const { id } = req.params;
    const data = await prisma.comment.delete({
      where: { id },
    });
    if (data) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "댓글을 찾을수 없습니다." });
    }
  })
);

export default app;
