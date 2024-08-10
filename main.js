import dotenv from "dotenv";
import express from "express";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/article", async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const keyword = req.query.keyword || "";
  try {
    const articles = await prisma.article.findMany({
      where: {
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
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalArticles = await prisma.article.count({
      where: {
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
      },
    });
    res.json({
      data: articles,
      total: totalArticles,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      totalPages: Math.ceil(totalArticles / pageSize),
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "internal server error" });
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

app.listen(3000, () => {
  console.log("Server is running");
});
