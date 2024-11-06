import articleService from "../services/article-service";
import { Request, Response, NextFunction } from "express";
import { PagenationQuery } from "../types/service-type";

async function getArticleList(
  req: Request<{}, {}, {}, PagenationQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const articleList = await articleService.getArticleList(req.query);
    return res.send(articleList);
  } catch (err) {
    return next(err);
  }
}

export default {
  getArticleList,
};
