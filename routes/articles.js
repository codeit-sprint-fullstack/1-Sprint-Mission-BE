import express from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandle } from "../utils/errorUtils.js";
import { assert } from "superstruct";
import { createArticle, updateArticle } from "../structs/articleStruct.js";
import { setOrderByQuery } from "../utils/orderByQuery.js";

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: 게시글
 */

const app = express.Router();
const prisma = new PrismaClient();

const getArticles = async (cursor, limit, whereConditions, orderbyQuery) => {
  const data = await prisma.article.findMany({
    where: whereConditions,
    take: limit + 1, //추가적인 게시글이 있는지 확인
    skip: cursor ? 1 : 0, //커서 자신을 스킵하기 위함
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: orderbyQuery,
    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
  return data;
};

app.get(
  "/",
  asyncHandle(async (req, res) => {
    const { orderBy = "recent", keyword = "", cursor = "" } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    // const offset = parseInt(req.query.offset) - 1 || 0;
    const orderbyQuery = setOrderByQuery(orderBy);

    const whereConditions = {};
    if (keyword) {
      whereConditions.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
      ];
    }

    const articles = await getArticles(
      cursor,
      limit,
      whereConditions,
      orderbyQuery
    );

    if (articles) {
      const nextArticles = articles.length > limit;
      const nextCursor = nextArticles ? articles[limit - 1].id : "";

      const returnData = {
        list: articles.slice(0, limit),
        nextCursor,
      };
      res.send(returnData);
    } else {
      res.status(404).send({ message: "댓글을 찾을수 없습니다." });
    }
  })
  //offset 방식 미션8에서 커서방식으로 변경
  // const [totalCount, data] = await prisma.$transaction([
  //   prisma.article.count({ where: whereConditions }),
  //   prisma.article.findMany({
  //     where: whereConditions,
  //     skip: offset * limit,
  //     take: limit,
  //     orderBy: orderbyQuery,
  //     include: {
  //       user: {
  //         select: {
  //           name: true,
  //           id: true,
  //         },
  //       },
  //     },
  //   }),
  // ]);
  // if (data) {
  //   res.send({ totalCount, list: data });
  // } else {
  //   res.status(404).send({ message: "게시글을 찾을수 없습니다." });
  // }
);

app.get(
  "/:id",
  asyncHandle(async (req, res) => {
    const { id } = req.params;
    const data = await prisma.article.findUnique({
      where: { id },
      include: {
        user: true,
        comment: {
          orderBy: { createAt: "desc" },
          include: { user: true },
        },
      },
    });

    if (data) {
      res.send(data);
    } else {
      res.status(404).send({ message: "게시글을 찾을수 없습니다." });
    }
  })
);

app.patch(
  "/:id",
  asyncHandle(async (req, res) => {
    assert(req.body, updateArticle);
    const { id } = req.params;
    const data = await prisma.article.update({
      where: { id },
      data: req.body,
      include: {
        user: true,
      },
    });

    if (data) {
      res.send(data);
    } else {
      res.status(404).send({ message: "게시글을 찾을수 없습니다." });
    }
  })
);

app.post(
  "/",
  asyncHandle(async (req, res) => {
    assert(req.body, createArticle);
    const data = await prisma.article.create({
      data: req.body,
      include: {
        user: true,
      },
    });

    if (data) {
      res.send(data);
    } else {
      res.status(404).send({ message: "게시글을 찾을수 없습니다." });
    }
  })
);

app.delete(
  "/:id",
  asyncHandle(async (req, res) => {
    const { id } = req.params;
    const data = await prisma.article.delete({
      where: { id },
    });

    if (data) {
      res.sendStatus(204);
    } else {
      res.status(404).send({ message: "게시글을 찾을수 없습니다." });
    }
  })
);

export default app;
