import express from "express";
import articleService from "../services/articleService.js";
import asyncHandler from "../utils/asyncHandler.js";
import validateData from "../middlewares/validateData.js";
import {
  attachUserId,
  setUserIdFromToken,
  verifyAccessToken,
  verifyArticleAuth,
} from "../middlewares/authorizationMiddleware.js";
import checkArticleLikeStatus from "../utils/checkArticleLikeStatus.js";

const articleController = express.Router();

articleController
  .route("/")
  .post(
    verifyAccessToken,
    validateData.article("post"),
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const article = await articleService.create(req.body);
      res.status(201).send(article);
    })
  )
  .get(
    asyncHandler(async (req, res, next) => {
      const articles = await articleService.getAllByFillter(req.query);
      const count = await articleService.countByFillter(req.query);
      const [list, total] = await Promise.all([articles, count]);

      return res.send({ total, list });
    })
  );

articleController
  .route("/:id")
  .get(
    setUserIdFromToken,
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const article = await articleService.getById(id);
      if (req.body.userId) {
        const isLiked = await checkArticleLikeStatus(req.body, id);
        const resBody = {
          ...article,
          isLiked,
        };
        res.send(resBody);
      } else {
        res.send(article);
      }
    })
  )
  .patch(
    verifyAccessToken,
    verifyArticleAuth,
    validateData.article("patch"),
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const article = await articleService.update(id, req.body);
      res.status(200).send(article);
    })
  )
  .delete(
    verifyAccessToken,
    verifyArticleAuth,
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      await articleService.deleteById(id);
      res.sendStatus(204);
    })
  );

export default articleController;
