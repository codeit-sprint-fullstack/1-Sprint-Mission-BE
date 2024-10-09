import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { imageUpload } from '../middleware/imagesFileUpload.js';
import {
  getArticles,
  getArticleId,
  patchArticle,
  deleteArticle,
  postArticle,
  postArticleFavorite,
} from '../controllers/articleController.js';

const router = express.Router();

router.get('/', getArticles);
router.get('/:articleId', getArticleId);
router.patch('/:articleId', authenticateToken, patchArticle);
router.delete('/:articleId', authenticateToken, deleteArticle);
router.post(
  '/',
  authenticateToken,
  imageUpload.array('images', 3),
  postArticle
);
router.post('/:articleId/favorites', authenticateToken, postArticleFavorite);

export default router;
