import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/article", async (req, res) => {
  const { keyword, page = 1, pageSize = 10 } = req.query;

  try {
    const conditions = keyword
      ? {
          OR: [
            {
              title: {
                contains: keyword,
                mode: "insensitive",
              },
            },
            {
              content: {
                contains: keyword,
                mode: "insensitive",
              },
            },
          ],
        }
      : {};

    const articles = await prisma.article.findMany({
      where: conditions,
      orderBy: {
        createAt: "asc",
      },
      skip: (page - 1) * pageSize,
      take: parseInt(pageSize),
    });

    const totalArticles = await prisma.article.count({ where: conditions });

    res.json({
      data: articles,
      total: totalArticles,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(totalArticles / pageSize),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/article", async (req, res) => {
  try {
    const { title, content } = req.body;
    const article = await prisma.article.create({
      data: {
        title,
        content,
      },
    });
    res.json(article);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
});

app.patch("/article/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const article = await prisma.article.update({
      where: {
        id,
      },
      data: {
        title,
        content,
      },
    });
    res.json(article);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
});

app.delete("/article/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.delete({
      where: {
        id,
      },
    });
    res.json(article);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
});

app.post("/article/:id/comment", async (req, res) => {
  const { articleId } = req.params;
  const { content } = req.body;

  try {
    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const comment = await prisma.articleComment.create({
      data: {
        content,
        articleId,
      },
    });
    res.satus(201).json(comment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running");
});
