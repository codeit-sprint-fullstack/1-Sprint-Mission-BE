import express from "express";
import * as dotenv from "dotenv";
import { PrismaClient, Prisma } from "@prisma/client";
import cors from "cors";

dotenv.config(); // 환경 변수를 불러옵니다.
const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (
        e.name === "StructError" ||
        e instanceof Prisma.PrismaClientValidationError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2025"
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

// 게시글 등록
app.post(
  "/articles",
  asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: {
        title,
        content,
      },
    });
    res.status(201).send(article);
  })
);

// 게시글 조회
app.get(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }
    res.send(article);
  })
);

// 게시글 수정
app.patch(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
      },
    });
    res.send(article);
  })
);

// 게시글 삭제
app.delete(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.article.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

// 게시글 목록 조회
app.get(
  "/articles",
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "", order = "recent" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const orderBy =
      order === "recent" ? { createdAt: "desc" } : { createdAt: "asc" };

    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
      skip: offset,
      take: parseInt(limit),
      orderBy,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });

    res.send(articles);
  })
);

// 댓글 등록 - 자유게시판
app.post(
  "/articles/:id/comments",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      return res.status(404).send({ message: "Article not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: id,
      },
    });
    res.status(201).send(comment);
  })
);

// 댓글 수정
app.patch(
  "/comments/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await prisma.comment.update({
      where: { id },
      data: {
        content,
      },
    });
    res.send(comment);
  })
);

// 댓글 삭제
app.delete(
  "/comments/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await prisma.comment.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

// 댓글 목록 조회 - 자유게시판
app.get(
  "/articles/:id/comments",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cursor, take = 10 } = req.query;

    const comments = await prisma.comment.findMany({
      where: { articleId: id },
      take: parseInt(take),
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    res.send({
      comments,
      nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
    });
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
