import articleService from "../services/article-service";
import { Request, Response, NextFunction } from "express";
import { PagenationQuery, UserId } from "../types/service-type";
import { CreateArticle } from "../struct/article-struct";

// article 목록 조회
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

// article 생성
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

// article 상세 조회
async function getArticleDetail(
  req: Request<{ id: string }, {}, { userId?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: articleId } = req.params;
    const { userId } = req.body;
    const article = await articleService.getArticleDetail({
      articleId,
      userId,
    });

    res.send(article);
  } catch (err) {
    return next(err);
  }
}

export default {
  getArticleList,
  createArticle,
  getArticleDetail
};
