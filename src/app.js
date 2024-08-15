import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  };
}
app.get("/", (req, res) => {
  res.send("default path");
});
// 게시글 목록 조회
app.get(
  "/articles",
  asyncHandler(async (req, res) => {
    const { page = 1, pageSize = 10, keyword = "" } = req.query;
    const offset = (page - 1) * pageSize;

    const searchQuery = keyword
      ? {
          OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        }
      : {};

    const totalArticles = await prisma.article.count({ where: searchQuery });
    const articles = await prisma.article.findMany({
      where: searchQuery,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: Number(pageSize),
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    res.send({ totalArticles, articles });
  })
);
// 게시글 조회
app.get(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const article = await prisma.article.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    if (article) {
      res.send(article);
    } else {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);
// 게시글 등록
app.post(
  "/articles",
  asyncHandler(async (req, res) => {
    const article = await prisma.article.create({
      data: req.body,
    });
    res.status(201).send(article);
  })
);
// 게시글 수정
app.patch(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const article = await prisma.article.update({
        where: { id: id },
        data: req.body,
      });
      res.send(article);
    } catch (error) {
      res.status(404).send({ message: "cannot find given id." });
    }
  })
);
// 게시글 삭제
app.delete(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      await prisma.article.delete({
        where: { id: id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);
// 중고마켓 댓글 목록 조회
app.get(
  "/market-comments",
  asyncHandler(async (req, res) => {
    const { cursor, take = 10, articleId } = req.query;

    const comments = await prisma.comment.findMany({
      where: {
        articleId: articleId,
        category: "MARKET",
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: Number(take),
    });

    const nextCursor =
      comments.length === Number(take)
        ? comments[comments.length - 1].id
        : null;

    res.send({
      comments,
      nextCursor,
    });
  })
);
// 자유게시판 댓글 목록 조회
app.get(
  "/board-comments",
  asyncHandler(async (req, res) => {
    const { cursor, take = 10, articleId } = req.query;

    const comments = await prisma.comment.findMany({
      where: {
        articleId: articleId,
        category: "BOARD",
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: Number(take),
    });

    const nextCursor =
      comments.length === Number(take)
        ? comments[comments.length - 1].id
        : null;

    res.send({
      comments,
      nextCursor,
    });
  })
);
// 중고마켓 댓글 등록
app.post(
  "/market-comments",
  asyncHandler(async (req, res) => {
    const comment = await prisma.comment.create({
      data: {
        ...req.body,
        category: "MARKET",
      },
    });
    res.status(201).send(comment);
  })
);
// 자유게시판 댓글 등록
app.post(
  "/board-comments",
  asyncHandler(async (req, res) => {
    const comment = await prisma.comment.create({
      data: {
        ...req.body,
        category: "BOARD",
      },
    });
    res.status(201).send(comment);
  })
);
// 댓글 수정
app.patch(
  "/comments/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
      const updatedComment = await prisma.comment.update({
        where: { id: id },
        data: req.body,
      });
      res.send(updatedComment);
    } catch (error) {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);
// 댓글 삭제
app.delete(
  "/comments/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;

    try {
      await prisma.comment.delete({
        where: { id: id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(404).send({ message: "Cannot find given id." });
    }
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
