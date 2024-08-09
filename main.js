import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const prisma = new PrismaClient();
const port = 3000;

app.get("/", async (req, res) => {
  const articles = await prisma.article.findMany();
  console.log("test");
  res.send(articles);
});
