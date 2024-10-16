import express from 'express';
import validateUuid from '../middlewares/validateUuid.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as controller from '../controllers/articleController.js';
import { articleAuthorization, authentication } from '../middlewares/auth.js';

const router = express.Router();

router.use('/:articleId', authentication, validateUuid);

router.get('/', asyncHandler(controller.getArticleList));

router.get('/:articleId', asyncHandler(controller.getArticleById));
router.post('/', authentication, asyncHandler(controller.createArticle));

router.patch(
  '/:articleId',
  articleAuthorization,
  asyncHandler(controller.updateArticleById)
);
router.delete(
  '/:articleId',
  articleAuthorization,
  asyncHandler(controller.deleteArticleById)
);
router.post('/:articleId/like', asyncHandler(controller.createLikeOnArticle));
router.delete('/:articleId/like', asyncHandler(controller.deleteLikeOnArticle));

export default router;
