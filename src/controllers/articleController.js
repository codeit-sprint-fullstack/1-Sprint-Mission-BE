import * as articleService from "../services/articleService.js";
import {
  ValidationError,
  NotFoundError,
} from "../middlewares/errorMiddleware.js";

export const createArticle = async (req, res) => {
  const article = await articleService.createArticle({
    ...req.body,
    writerId: req.user.id,
  });
  res.status(201).json(article);
};

export const getArticles = async (req, res) => {
  const { page = 1, limit = 10, order = "recent" } = req.query;
  const { articles, totalCount } = await articleService.getArticles(
    (page - 1) * limit,
    Number(limit),
    order === "recent" ? { createdAt: "desc" } : { createdAt: "asc" }
  );
  res.json({ totalCount, list: articles });
};

export const getArticleById = async (req, res) => {
  const article = await articleService.getArticleById(req.params.id);
  if (!article) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }
  res.json(article);
};

export const updateArticle = async (req, res) => {
  const updatedArticle = await articleService.updateArticle(
    req.params.id,
    req.body
  );
  if (!updatedArticle) {
    throw new NotFoundError("게시글을 찾을 수 없습니다.");
  }
  res.json(updatedArticle);
};

export const deleteArticle = async (req, res) => {
  await articleService.deleteArticle(req.params.id);
  res.status(204).send();
};
