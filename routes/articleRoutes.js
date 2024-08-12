import express from 'express';
import * as a from '../controllers/articleControllers.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

router.get('/', asyncHandler(a.getArticles));
router.get('/:id', asyncHandler(a.getArticleById));
router.post('/', asyncHandler(a.createArticle));
router.patch('/:id', asyncHandler(a.updateArticleById));
router.delete('/:id', asyncHandler(a.deleteArticleById));

export default router;
