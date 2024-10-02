import express from "express";
import articleService from "../services/articleService.js";
import asyncHandler from "../services/errorService.js";

const articleController = express.Router();

articleController
  .route("/")
  .post(
    asyncHandler(async (req, res, next) => {
      const article = await articleService.create(req.body);
      res.status(201).send(article);
    })
  )
  .get(
    asyncHandler(async (req, res, next) => {
      const articles = await articleService.getAllByFilter(req.query);
      const count = await articleService.countByFilter(req.query);
      const [list, total] = await Promise.all([articles, count]);

      return res.send({ total, list });
    })
  );

articleController
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await articleService.getById(id);
      res.send(article);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const article = await articleService.update(id, req.body)
      res.status(201).send(article);
    })
  )
  .delete(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      await prisma.article.delete({
        where: { id },
      });
      res.sendStatus(204);
    })
  );

export default articleController;
