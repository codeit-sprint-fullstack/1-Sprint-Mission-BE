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
  userId: true,
  title: true,
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
    const { title, content } = req.body;

    const result = await prisma.article.create({
      data: {
        userId: authorization,
        title: title,
        content: content,
      },
      select: resultArticleFormat,
    });

    res.status(201).send(result);
  })
);

/** /article GET */
app.get(
  "/article",
  asyncHandler(async (req, res) => {
    const articles = await prisma.article.findMany({
      select: resultArticleFormat,
    });

    res.status(200).send(articles);
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

/** /comment POST */
app.post("/comment", async (req, res) => {
  const { authorization } = req.headers;
  const { articleId, content } = req.body;

  const data = {
    userId: authorization,
    articleId: articleId,
    content: content,
  };

  const newArticle = await prisma.article.create({ data: data });

  res.status(200);
  res.send(newArticle);
});

/** /comment GET */
app.get("/comment", async (req, res) => {
  const comments = await prisma.comment.findMany();

  res.status(200);
  res.send(comments);
});

/** /article/:id/comment */
app.get("/article/:id/comment", async (req, res) => {
  const { id } = req.headers;
});

/** /comment/:id GET */
app.get("/commnet", async (req, res) => {
  const { id } = req.params;

  const comment = await prisma.comment.findUnique({ where: { id } });

  res.status(200);
  res.send(comment);
});

/** /comment/:id PATCH */
app.patch("/comment/:id", async (req, res) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  const editableProperties = ["content"];
  const updateData = req.body;
  let updateDataCopy = JSON.parse(JSON.stringify(updateData));
  let result = null;

  for (const key of editableProperties) {
    delete updateDataCopy[`${key}`];
  }

  if (Object.keys(updateDataCopy).length > 0) {
    res.status(400);
    result = { message: "Bad Request" };
  } else {
    const comment = await prisma.article.findUnique({ where: { id } });

    if (authorization === comment.id) {
      const updated = await prisma.article.update({
        where: { id },
        data: updateData,
      });
      res.status(200);
      result = updated;
    } else {
      res.status(401);
      result = { message: "Unauthorized" };
    }
  }

  res.send(result);
});

/** /comment/:id DELETE */
app.delete("/comment/:id", async (req, res) => {
  const { id } = req.params;
  const { authorization } = req.header;
  let result = null;

  const comment = await prisma.comment.findUnique({ where: { id } });

  if (authorization === comment.id) {
    const deleted = await prisma.comment.delete({ where: { id } });
    res.status(200);
    result = deleted;
  } else {
    res.status(401);
    result = { message: "Unathorized" };
  }

  res.send(result);
});

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
