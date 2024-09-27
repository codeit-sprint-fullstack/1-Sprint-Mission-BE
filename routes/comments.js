import express from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandle } from "../utils/errorUtils.js";
import { assert } from "superstruct";
import { createComment, updateComment } from "../structs/commentStruct.js";
const app = express.Router();
const prisma = new PrismaClient();

const getComments = async (cursor, limit, id) => {
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

/**
 * @swagger
 * paths:
 *  /Comments:
 *    get:
 *      summary: "유저 데이터 전체조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [Comments]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    ok:
 *                      type: boolean
 *                    users:
 *                      type: object
 *                      example:
 *                          [
 *                            { "id": 1, "name": "유저1" },
 *                            { "id": 2, "name": "유저2" },
 *                            { "id": 3, "name": "유저3" },
 *                          ]
 */

app.get(
  "/:id",
  asyncHandle(async (req, res) => {
    const { limit = 5, cursor = "" } = req.query;
    const { id } = req.params;

    const comments = await getComments(cursor, limit, id);

    if (comments) {
      const nextComments = comments.length > limit;
      const nextCursor = nextComments ? comments[limit - 1].id : null;

      const returnData = {
        comments: comments.slice(0, limit),
        Cursor: nextCursor,
      };
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
