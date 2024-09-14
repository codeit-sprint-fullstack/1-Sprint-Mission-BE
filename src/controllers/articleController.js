import { PrismaClient } from "@prisma/client";
import { assert } from "superstruct";

import { CreateArticle, PatchArticle } from "../validation/structs.js";

const prisma = new PrismaClient();

//get article list
// query parameter: orderBy, page, pageSize, keyword
export const getArticles = async (req, res) => {
  const { orderBy } = req.query || "recent";
  const page = parseInt(req.query.page) * 1 || 1;
  const pageSize = parseInt(req.query.pageSize) * 1 || 10;
  const keyword = req.query.keyword || "";

  const offset = (page - 1) * pageSize;

  let sortOption;
  switch (orderBy) {
    case "like":
      sortOption = { likeCount: "desc" };
      break;
    case "recent":
    default:
      sortOption = { createdAt: "desc" };
      break;
  }

  let searchQuery = {};
  if (keyword && keyword.trim() !== "")
    searchQuery = {
      OR: [
        { title: { contains: keyword } },
        { content: { contains: keyword } },
      ],
    };

  const [totalCount, articles] = await Promise.all([
    prisma.article.count({ where: searchQuery }),
    prisma.article.findMany({
      where: searchQuery,
      orderBy: sortOption,
      skip: offset,
      take: pageSize,
    }),
  ]);

  res.send({ totalCount, list: articles });
};

//get article by id
export const getArticleById = async (req, res) => {
  const { id } = req.params;

  const article = await prisma.article.findUniqueOrThrow({
    where: { id },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
    },
  });

  res.send(article);
};

// create new article
export const createArticle = async (req, res) => {
  assert(req.body, CreateArticle);
  const newArticle = await prisma.article.create({
    data: req.body,
  });
  res.status(201).send(newArticle);
};

// patch existed article with id
export const updateArticleById = async (req, res) => {
  assert(req.body, PatchArticle);
  const { id } = req.params;
  const article = await prisma.article.update({
    where: { id },
    data: req.body,
  });
  res.send(article);
};

// delete an article by id
export const deleteArticleById = async (req, res) => {
  const { id } = req.params;
  await prisma.article.delete({ where: { id } });

  res.status(200).send({ message: "Article has deleted successfully" });
};
