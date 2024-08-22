import * as dotenv from "dotenv";
import express from "express";
import cors from "cors"; //  서로 다른 IP에 위치한 클라이언트와 서버가 데이터를 주고 받을 수 있게 만듦
import { PrismaClient, Prisma } from "@prisma/client";
import { assert } from "superstruct";
import {
  CreateArticle,
  CreateProduct,
  CreateComment,
  PatchArticle,
  PatchProduct,
  PatchComment,
} from "./struct.js";

dotenv.config();
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
        e instanceof Prisma.PrismaClientKnownRequestError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e.code === "P2025" &&
        e instanceof Prisma.PrismaClientKnownRequestError
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}

//  products  //

app.post(
  "/products",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateProduct);
    const product = await prisma.product.create({
      data: req.body,
    });
    res.status(201).send(product);
  })
);

app.get(
  "/products",
  asyncHandler(async (req, res) => {
    const {
      order = "recent",
      page = 1,
      pageSize = 10,
      search = "",
    } = req.query;

    let orderBy;

    switch (order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "recent":
      default:
        orderBy = { createdAt: "desc" };
    }

    const query = {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    };

    const totalCount = await prisma.product.count({
      where: query,
    });

    const product = await prisma.product.findMany({
      where: query,
      orderBy,
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize, 10),
    });
    res.send({ list: product, totalCount });
  })
);

app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUniqueOrThrow({
      where: { id },
      include: {
        comment: true,
      }
    });
    res.send(product);
  })
);

app.patch(
  "/products/:id",
  asyncHandler(async (req, res) => {
    assert(req.body, PatchProduct);
    const id = parseInt(req.params.id);
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.send(product);
  })
);

app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.product.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

//  articles  //

app.post(
  "/articles",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateArticle);
    const article = await prisma.article.create({
      data: req.body,
    });
    res.status(201).send(article);
  })
);

app.get(
  "/articles",
  asyncHandler(async (req, res) => {
    const { order = "recent", offset = 0, limit = 5 } = req.query;
    let orderBy;
    switch (order) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "recent":
      default:
        orderBy = { createdAt: "desc" };
    }
    const article = await prisma.article.findMany({
      orderBy,
      skip: offset * limit,
      take: limit,
    });
    res.send(article);
  })
);

app.get(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const article = await prisma.article.findUniqueOrThrow({
      where: { id },
      include: {
        comment: true,
      }
    });
    res.send(article);
  })
);

app.patch(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    assert(req.body, PatchArticle);
    const id = parseInt(req.params.id);
    const article = await prisma.article.update({
      where: { id },
      data: req.body,
    });
    res.send(article);
  })
);

app.delete(
  "/articles/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    await prisma.article.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

//  comments  //

// 중고마켓 댓글 등록
app.post(
  "/products/:productId/comments",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);

    const { content } = req.body;
    const productId = parseInt(req.params.productId);

    const comment = await prisma.comment.create({
      data: { content, productId: productId },
    });
    res.status(201).send(comment);
  })
);

// 자유게시판 댓글 등록
app.post(
  "/articles/:articleId/comments",
  asyncHandler(async (req, res) => {
    assert(req.body, CreateComment);

    const { content } = req.body;
    const articleId = parseInt(req.params.articleId);

    const comment = await prisma.comment.create({
      data: { content, articleId: articleId },
    });
    res.status(201).send(comment);
  })
);

// 중고마켓 댓글 목록 조회
app.get(
  "/products/:productId/comments",
  asyncHandler(async (req, res) => {
    const productId = parseInt(req.params.productId);
    const { cursor, limit = 5 } = req.query;

    const comment = await prisma.comment.findMany({
      where: { productId: parseInt(productId) },
      skip: cursor ? 1 : 0,
      take: parseInt(limit),
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { createdAt: "desc" },
    });
    res.send(comment);
  })
);

// 자유게시판 댓글 목록 조회
app.get(
  "/articles/:articleId/comments",
  asyncHandler(async (req, res) => {
    const articleId = parseInt(req.params.articleId);
    const { cursor, limit = 5 } = req.query;

    const comment = await prisma.comment.findMany({
      where: { articleId: parseInt(articleId) },
      skip: cursor ? 1 : 0,
      take: parseInt(limit),
      cursor: cursor ? { id: parseInt(cursor) } : undefined,
      orderBy: { createdAt: "desc" },
    });
    res.send(comment);
  })
);

app.patch(
  "/comments/:id",
  asyncHandler(async (req, res) => {
    assert(req.body, PatchComment);

    const { content } = req.body;
    const id = parseInt(req.params.id);

    const comment = await prisma.comment.update({
      where: { id },
      data: { content },
    });
    res.send(comment);
  })
);

app.delete(
  "/comments/:id",
  asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);

    await prisma.comment.delete({
      where: { id },
    });
    res.sendStatus(204);
  })
);

app.listen(3000, () => console.log("Server is running"));
