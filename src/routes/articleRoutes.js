import express from "express";
import { body, param, query } from "express-validator";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validate } from "../middlewares/validate.js";
import * as articleService from "../services/articleService.js";

const router = express.Router();

router.post(
  "/",
  [
    body("title").isString().isLength({ min: 1, max: 50 }),
    body("content").isString().notEmpty(),
    body("image").isURL(),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const article = await articleService.createArticle({
      ...req.body,
      writerId: req.user.id,
    });
    res.status(201).json(article);
  })
);
