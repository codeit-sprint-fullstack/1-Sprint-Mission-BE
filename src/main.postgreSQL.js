import express from "express";
import cors from "cors";
import { DB_URL, PORT } from "./config.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

/** /article POST */
app.post(async (req, res) => {
  const { authorization } = req.headers;
  const { title, content } = req.body;

  await prisma.article.create({
    data: {
      userId: authorization,
      title: title,
      content: content,
    },
  });
});

/** /article GET */
app.get("/articles", async (req, res) => {
  const articles = await prisma.article.findMany();
  res.status(200);
  res.send(articles);
});

/** /artcile/:id GET */
app.get("/articles/:id", async (req, res) => {
  const { id } = req.params;
  const article = await prisma.article.findUnique({
    where: { id },
  });
  res.status(200);
  res.send(article);
});

/** /article/:id PATCH */
app.patch("/articles/:id", async (req, res) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  const updateData = req.body;
  const editableProperties = ["title", "content"];
  let updateDataCopy = JSON.parse(JSON.stringify(updateData));
  let result = null;

  const origin = await prisma.article.findUnique({ where: { id } });

  for (const key of editableProperties) {
    delete updateDataCopy[`${key}`];
  }

  if (Object.keys(updateDataCopy).length > 0) {
    res.status(400);
    result = { message: "Bad Request" };
  } else if (id === origin.id) {
    const updated = await prisma.article.update({});
    result = updated;
  } else {
    res.status(401);
    result = { message: "Unauthorized" };
  }

  res.send(result);
});

/** /article/:id DELETE */
app.delete("/articles/:id", async (req, res) => {
  const { id } = req.params;
  const { authorization } = req.headers;
  let result = null;

  const origin = await prisma.article.findUnique({ where: { id } });

  if (authorization === origin.id) {
    const deleted = await prisma.article.delete({ where: { id } });
    res.status(200);
    result = deleted;
  } else {
    res.status(401);
    result = { message: "Unauthorized" };
  }

  res.send(result);
});

/** /comment POST */
app.post("/comments", async (req, res) => {
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
app.get("/comments", async (req, res) => {
  const comments = await prisma.comment.findMany();

  res.status(200);
  res.send(comments);
});

/** /comment/:id GET */
app.get("/commnets", async (req, res) => {
  const { id } = req.params;

  const comment = await prisma.comment.findUnique({ where: { id } });

  res.status(200);
  res.send(comment);
});

/** /comment/:id PATCH */
app.patch(async (req, res) => {
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
app.delete(async (req, res) => {
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
