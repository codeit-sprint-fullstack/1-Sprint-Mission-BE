// articleController.js
import * as articleService from '../services/articleService.js';
import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '../middlewares/errorMiddleware.js';

export const createArticle = async (req, res) => {
  const article = await articleService.createArticle({
    ...req.body,
    writerId: req.user.id, // 로그인한 사용자 ID를 writerId로 설정
  });
  res.status(201).json(article);
};

export const getArticles = async (req, res) => {
  const { page = 1, limit = 10, order = 'recent' } = req.query;
  const { articles, totalCount } = await articleService.getArticles(
    (page - 1) * limit,
    Number(limit),
    order === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' }
  );
  res.json({ totalCount, list: articles });
};

export const getArticleById = async (req, res) => {
  const article = await articleService.getArticleById(req.params.id);
  if (!article) {
    throw new NotFoundError('게시글을 찾을 수 없습니다.');
  }
  res.json(article);
};

export const updateArticle = async (req, res) => {
  const article = await articleService.getArticleById(req.params.id);
  if (article.writerId !== req.user.id) {
    // 작성자 확인
    throw new ForbiddenError('게시글을 수정할 권한이 없습니다.');
  }
  const updatedArticle = await articleService.updateArticle(
    req.params.id,
    req.body
  );
  res.json(updatedArticle);
};

export const deleteArticle = async (req, res) => {
  const article = await articleService.getArticleById(req.params.id);
  if (article.writerId !== req.user.id) {
    // 작성자 확인
    throw new ForbiddenError('게시글을 삭제할 권한이 없습니다.');
  }
  await articleService.deleteArticle(req.params.id);
  res.status(204).send();
};

export const toggleLike = async (req, res) => {
  const result = await articleService.toggleLike(req.params.id, req.user.id);
  res.json(result);
};
