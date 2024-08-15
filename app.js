import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import { Category, CommentType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.name === "StructError" || e instanceof Prisma.PrismaClientValidationError) {
        res.status(400).send({ message: e.message });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

/***** article *****/

// 게시글 등록 api
app.post(
  "/articles",
  asyncHandler(async (req, res) => {
    const { title, content, category } = req.body;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        category,
      },
    });
    res.status(201).send(article);
  })
);

// 게시글 조회 api
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

    res.send(article);
  })
);

// 게시글 수정 api
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

// 게시글 삭제 api
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

// 게시글 목록 조회 api
app.get(
  "/articles",
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = "", order = "" } = req.query;

    const offset = parseInt(page - 1) * parseInt(limit);

    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { content: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const orderBy = order === "recent" ? { createdAt: "desc" } : {};

    const articles = await prisma.article.findMany({
      where,
      skip: parseInt(offset),
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

/***** comment *****/

// 댓글 등록 api -자유게시판
app.post(
  "/free-board/:id/comments",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article || article.category !== Category.FREE_BOARD) {
      return res.status(404).json({ error: "Free board article no found" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: id,
        type: CommentType.FREE_BOARD_COMMENT,
      },
    });
    res.status(201).send(comment);
  })
);

// 댓글 등록 api - 중고마켓
app.post(
  "/market/:id/comments",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article || article.category !== Category.MARKET) {
      return res.status(404).json({ error: "Market article not found" });
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        articleId: id,
        type: CommentType.MARKET_COMMENT,
      },
    });
    res.status(201).send(comment);
  })
);

// 댓글 수정 api
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

// 댓글 삭제 api
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

// 댓글 목록 조회 api - 자유게시판
app.get(
  "/free-board/:id/comments",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cursor, take = 10 } = req.query;

    const comments = await prisma.comment.findMany({
      where: {
        articleId: id,
        type: CommentType.FREE_BOARD_COMMENT,
      },
      take: parseInt(take),
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    // 댓글 목록과 함께 다음 커서 정보를 전송
    res.send({
      comments,
      nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
    });
  })
);

// 댓글 목록 조회 api - 마켓
app.get(
  "/free-board/:id/comments",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { cursor, take = 10 } = req.query;

    const comments = await prisma.comment.findMany({
      where: { articleId: id, type: CommentType.MARKET_COMMENT },
      take: take,
      skip: cursor ? 1 : 0,
      ...(cursor && { cursor: { id: cursor } }),
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });

    // 댓글 목록과 함께 다음 커서 정보를 전송
    res.send({
      comments,
      nextCursor: comments.length > 0 ? comments[comments.length - 1].id : null,
    });
  })
);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
