import express from "express";
import cors from "cors";
// import asyncHandler from "express-async-handler";
import { Prisma } from "@prisma/client";
import { assert } from "superstruct";
import { DB_URL, PORT } from "./config.js";
import { PrismaClient } from "@prisma/client";
import { Article } from "./structs/article.js";
import { Comment } from "./structs/comment.js";

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

function throwUnauthorized() {
  const error = new Error("Unauthorized");
  error.status = 401;
  throw error;
}

const resultArticleFormat = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
};

const resultArticleCommentFormat = {
  id: true,
  content: true,
  createdAt: true,
};

const resultProductCommentFormat = {
  id: true,
  content: true,
  createdAt: true,
};

function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (e.status === 401) {
        res.status(401).send({ message: "Unauthorized" });
      } else if (e instanceof Prisma.PrismaClientKnownRequestError) {
        // 유니크 키 제약 위반
        if (e.code === "P2002") {
          res.status(409).send({
            message: "Unique constraint failed on the field: " + e.meta.target,
          });
        } else if (e.code === "P2025") {
          res.status(404).send({ message: "Not Found" });
        } else {
          res.status(400).send({ message: e.message });
        }
      } else if (
        e instanceof Prisma.PrismaClientValidationError ||
        e.name === "StructError"
      ) {
        res.status(400).send({ message: "Validation error: " + e.message });
      } else if (e instanceof Prisma.PrismaClientRustPanicError) {
        res
          .status(500)
          .send({ message: "Internal server error: " + e.message });
      } else if (e instanceof Prisma.PrismaClientUnknownRequestError) {
        res
          .status(500)
          .send({ message: "Unknown request error: " + e.message });
      } else if (e instanceof Prisma.PrismaClientInitializationError) {
        res.status(500).send({ message: "Initialization error: " + e.message });
      } else {
        // 기타 예외 처리
        res.status(500).send({ message: e.message });
      }
    }
  };
}

/** /article POST */
app.post(
  "/article",
  asyncHandler(async (req, res) => {
    const { authorization } = req.headers; // 임시 코드 검증 코드 방식 미정
    assert(req.body, Article);

    const data = {
      userId: authorization,
      ...req.body,
    };

    const result = await prisma.article.create({
      data: data,
      select: resultArticleFormat,
    });

    res.status(201).send(result);
  })
);

/** /article GET */
app.get(
  "/article",
  asyncHandler(async (req, res) => {
    const {
      pageSize = 10,
      page = 1,
      orderBy = "recent",
      keyword = null,
    } = req.query;
    const castedTake = Number(pageSize);
    const castedOffset = Number(page) - 1;
    const skip = castedTake * castedOffset;
    let castedOrderBy = { createdAt: "desc" };
    if (orderBy === "favorite") {
      castedOrderBy = { favorite: "desc" };
    }

    let articles = undefined;
    let totalCount = 0;

    if (!keyword) {
      articles = await prisma.article.findMany({
        where: { title: { contains: keyword } },
        skip: skip,
        take: castedTake,
        orderBy: castedOrderBy,
        select: resultArticleFormat,
      });

      totalCount = await prisma.study.count({
        where: { title: { contains: keyword } },
      });
    } else {
      articles = await prisma.article.findMany({
        skip: skip,
        take: castedTake,
        orderBy: castedOrderBy,
        select: resultArticleFormat,
      });

      totalCount = await prisma.study.count();
    }

    const result = { totalCount, articles };
    res.status(200).send(result);
  })
);

/** /artcile/:id GET */
app.get(
  "/article/:id",
  asyncHandler(async (req, res) => {
    const { id: articleId } = req.params;
    const article = await prisma.article.findUniqueOrThrow({
      where: { id: articleId },
      select: resultArticleFormat,
    });

    res.status(200).send(article);
  })
);

/** /article/:id PATCH */
app.patch(
  "/article/:id",
  asyncHandler(async (req, res) => {
    const { id: articleId } = req.params;
    assert(req.body, Article);
    const { authorization } = req.headers;

    const { userId: userId } = await prisma.article.findUniqueOrThrow({
      where: { id: articleId },
    });

    if (userId !== authorization) {
      throwUnauthorized();
    }

    const result = await prisma.article.update({
      where: { id: articleId },
      data: req.body,
      select: resultArticleFormat,
    });

    res.status(200).send(result);
  })
);

/** /article/:id DELETE */
app.delete(
  "/article/:id",
  asyncHandler(async (req, res) => {
    const { id: articleId } = req.params;
    const { authorization } = req.headers;

    const { userId: userId } = await prisma.article.findUniqueOrThrow({
      where: { id: articleId },
    });

    if (userId !== authorization) {
      throwUnauthorized();
    }

    await prisma.article.delete({
      where: { id: articleId },
    });

    res.sendStatus(204);
  })
);

// 기사 댓글 API
/** /article/:id/comment POST */
app.post(
  "/article/:id/comment",
  asyncHandler(async (req, res) => {
    const { authorization } = req.headers;
    assert(req.body, Comment);
    const { id: articleId } = req.params;
    const { content } = req.body;

    const data = {
      userId: authorization,
      articleId: articleId,
      content: content,
    };

    const newConment = await prisma.articleComment.create({
      data: data,
      select: resultArticleCommentFormat,
    });

    res.status(201).send(newConment);
  })
);

/** /article/:id/comment GET */
app.get(
  "/article/:id/comment",
  asyncHandler(async (req, res) => {
    const { cursor, pageSize = 10 } = req.query;
    const castedTake = Number(pageSize);
    const { id: articleId } = req.params;
    const comments = await prisma.articleComment.findMany({
      where: { articleId: articleId },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: castedTake,
      orderBy: { createdAt: "asc" },
      select: resultArticleCommentFormat,
    });

    res.status(200).send(comments);
  })
);

/** /article/comment/:id */
app.get(
  "/article/comment/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comments = await prisma.articleComment.findUniqueOrThrow({
      where: { id },
      select: resultArticleCommentFormat,
    });

    res.status(200).send(comments);
  })
);

/** /article/comment/:id PATCH */
app.patch(
  "/article/comment/:id",
  asyncHandler(async (req, res) => {
    const { id: commentId } = req.params;
    const { authorization } = req.headers;

    const { userId } = await prisma.articleComment.findUnique({
      where: { id: commentId },
    });

    if (userId !== authorization) {
      throwUnauthorized();
    }

    const result = await prisma.articleComment.update({
      where: { id: commentId },
      data: req.body,
      select: resultArticleCommentFormat,
    });

    res.status(200).send(result);
  })
);

/** /article/comment/:id DELETE */
app.delete(
  "/article/comment/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;

    const { userId } = await prisma.articleComment.findUnique({
      where: { id },
    });

    if (userId !== authorization) {
      throwUnauthorized();
    }

    await prisma.articleComment.delete({ where: { id } });

    res.sendStatus(204);
  })
);

// 상품 댓글 API
/** /product/:id/comment POST */
app.post(
  "/product/:id/comment",
  asyncHandler(async (req, res) => {
    const { authorization } = req.headers;
    assert(req.body, Comment);
    const { id: productId } = req.params;
    const { content } = req.body;

    const data = {
      userId: authorization,
      productId: productId,
      content: content,
    };

    const newConment = await prisma.productComment.create({
      data: data,
      select: resultProductCommentFormat,
    });

    res.status(201).send(newConment);
  })
);

/** /product/:id/comment GET */
app.get(
  "/product/:id/comment",
  asyncHandler(async (req, res) => {
    const { id: productId } = req.params;
    const { cursor, pageSize = 10 } = req.query;
    const castedTake = Number(pageSize);
    const comments = await prisma.productComment.findMany({
      where: { productId: productId },
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      take: castedTake,
      orderBy: { createdAt: "asc" },
      select: resultProductCommentFormat,
    });

    res.status(200).send(comments);
  })
);

/** /product/comment/:id */
app.get(
  "/product/comment/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comments = await prisma.productComment.findUniqueOrThrow({
      where: { id },
      select: resultProductCommentFormat,
    });

    res.status(200).send(comments);
  })
);

/** /product/comment/:id PATCH */
app.patch(
  "/product/comment/:id",
  asyncHandler(async (req, res) => {
    const { id: commentId } = req.params;
    const { authorization } = req.headers;

    const { userId } = await prisma.productComment.findUnique({
      where: { id: commentId },
    });

    if (userId !== authorization) {
      throwUnauthorized();
    }

    const result = await prisma.productComment.update({
      where: { id: commentId },
      data: req.body,
      select: resultProductCommentFormat,
    });

    res.status(200).send(result);
  })
);

/** /product/comment/:id DELETE */
app.delete(
  "/product/comment/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;

    const { userId } = await prisma.productComment.findUnique({
      where: { id },
    });

    if (userId !== authorization) {
      throwUnauthorized();
    }

    await prisma.productComment.delete({ where: { id } });

    res.sendStatus(204);
  })
);

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
