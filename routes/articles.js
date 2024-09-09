import express from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandle } from "../errorUtils.js";
import { assert } from "superstruct";
import { createArticle, updateArticle } from "../structs/articleStruct.js";

const app = express.Router();
const prisma = new PrismaClient();

app.get(
  "/",
  asyncHandle(async (req, res) => {
    const { orderBy = "recent", keyword = "" } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) - 1 || 0;
    let orderbyQuery;
    switch (orderBy) {
      case "title":
        orderbyQuery = { title: "asc" };
        break;
      case "recent":
        orderbyQuery = { createAt: "desc" };
        break;
      case "oldset":
        orderbyQuery = { createAt: "asc" };
        break;
      case "favorite":
        orderbyQuery = { favorite: "desc" };
        break;
      default:
        orderbyQuery = { createAt: "asc" };
    }
    const whereConditions = {};
    if (keyword) {
      whereConditions.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
      ];
    }
    const [totalCount, data] = await prisma.$transaction([
      prisma.article.count({ where: whereConditions }),
      prisma.article.findMany({
        where: whereConditions,
        skip: offset * limit,
        take: limit,
        orderBy: orderbyQuery,
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      }),
    ]);

    if (data) {
      res.send({ totalCount, list: data });
    } else {
      res.status(404).send({ message: "게시글을 찾을수 없습니다." });
    }
  })
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
