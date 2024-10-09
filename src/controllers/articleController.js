import * as articleService from '../services/articleService.js';
import { CreateArticle, assert, PatchArticle } from '../validations/structs.js';

export const getArticleList = async (req, res) => {
  const { orderBy } = req.query || 'recent';
  const page = parseInt(req.query.page) * 1 || 1;
  const pageSize = parseInt(req.query.pageSize) * 1 || 10;
  const keyword = req.query.keyword || '';

  const articles = await articleService.getArticles({
    orderBy,
    page,
    pageSize,
    keyword,
  });

  return res.json(articles);
};

export const getArticleById = async (req, res) => {
  const { articleId } = req.params;
  const article = await articleService.getArticle(articleId);
  return res.json(article);
};

export const createArticle = async (req, res) => {
  const user = req.user;
  const data = req.body;

  assert(data, CreateArticle);

  const newArticle = await articleService.createArticle(user.id, data);
  return res.status(201).json(newArticle);
};

export const updateArticleById = async (req, res) => {
  const { articleId } = req.params;
  const data = req.body;

  assert(data, PatchArticle);

  const updatedArticle = await articleService.updateArticle(articleId, data);
  return res.json(updatedArticle);
};

export const deleteArticleById = async (req, res) => {
  const { articleId } = req.params;
  await articleService.deleteArticle(articleId);
  return res.status(204).json({ message: '게시글이 삭제되었습니다' });
};

export const createLikeOnArticle = async (req, res) => {
  const { articleId } = req.params;
  const userId = req.user.id;
  const article = await articleService.createLike(articleId, userId);
  return res.json(article);
};

export const deleteLikeOnArticle = async (req, res) => {
  const { articleId } = req.params;
  const userId = req.user.id;
  const article = await articleService.deleteLike(articleId, userId);
  return res.json(article);
};
