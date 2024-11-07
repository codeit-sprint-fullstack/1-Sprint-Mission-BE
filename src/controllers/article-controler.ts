import articleService from "../services/article-service";
import { Request, Response, NextFunction } from "express";
import { PagenationQuery, UserId } from "../types/service-type";
import { CreateArticle } from "../struct/article-struct";

async function getArticleList(
  req: Request<{}, {}, {}, PagenationQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const articleList = await articleService.getArticleList(req.query);
    res.send(articleList);
  } catch (err) {
    return next(err);
  }
}

async function createArticle(
  req: Request<{}, {}, UserId & CreateArticle>,
  res: Response,
  next: NextFunction
) {
  try {
    const article = await articleService.createArticle(req.body);
    res.status(201).send(article);
  } catch (err) {
    return next(err);
  }
}

export default {
  getArticleList,
  createArticle,
};
