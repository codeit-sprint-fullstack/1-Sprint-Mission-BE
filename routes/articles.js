import express from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandle } from "../utils/errorUtils.js";
import { assert } from "superstruct";
import { createArticle, updateArticle } from "../structs/articleStruct.js";
import articleService from "../service/articleService.js";

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: 게시글
 */

const app = express.Router();
const prisma = new PrismaClient();

app.get(
  "/",
  asyncHandle(async (req, res, next) => {
    try {
      const data = await articleService.getArticles(req.query);
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  })
);

app.get(
  "/:id",
  asyncHandle(async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await articleService.getArticle(id);
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  })
);

app.patch(
  "/:id",
  asyncHandle(async (req, res, next) => {
    assert(req.body, updateArticle);
    try {
      const { id } = req.body;
      const data = await articleService.updateArticle(id);
      return res.status(200).send(data);
    } catch (error) {
      next(error);
    }
  })
);

app.post(
  "/",
  asyncHandle(async (req, res, next) => {
    assert(req.body, createArticle);
    try {
      const data = await articleService.createArticle(req.body);
      return res.status(201).send(data);
    } catch (error) {
      next();
    }
  })
);

app.delete(
  "/:id",
  asyncHandle(async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await articleService.deleteArticle(id);
      return res.status(204).send(data);
    } catch (error) {
      next();
    }
  })
);

export default app;
