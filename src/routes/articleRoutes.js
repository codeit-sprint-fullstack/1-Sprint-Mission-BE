import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import {
  getArticles,
  getArticleId,
  patchArticle,
  deleteArticle,
  postArticle,
  removeFavorite,
  addFavorite,
} from '../controllers/articleController.js';

const router = express.Router();

router.get('/', getArticles);
router.get('/:articleId', getArticleId);
router.patch('/:articleId', authenticateToken, patchArticle);
router.delete('/:articleId', authenticateToken, deleteArticle);
router.post('/', authenticateToken, postArticle);
router.post(
  '/:articleId/favorites',
  authenticateToken,
  addFavorite,
  removeFavorite
);

export default router;
