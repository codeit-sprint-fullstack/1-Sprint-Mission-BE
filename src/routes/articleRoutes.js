// articleRoutes.js

import express from 'express';
import { body, param, query } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import * as articleController from '../controllers/articleController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .post(
    authMiddleware,
    [
      body('title').isString().isLength({ min: 1, max: 100 }),
      body('content').isString().notEmpty(),
    ],
    validate,
    asyncHandler(articleController.createArticle)
  )
  .get(
    [
      query('page').optional().isInt({ min: 1 }),
      query('limit').optional().isInt({ min: 1, max: 100 }),
    ],
    validate,
    asyncHandler(articleController.getArticles)
  );

router
  .route('/:id')
  .get(
    [param('id').isInt({ min: 1 })],
    validate,
    asyncHandler(articleController.getArticleById)
  )
  .put(
    authMiddleware,
    [
      param('id').isInt({ min: 1 }),
      body('title').optional().isString().isLength({ min: 1, max: 100 }),
      body('content').optional().isString().notEmpty(),
    ],
    validate,
    asyncHandler(articleController.updateArticle)
  )
  .delete(
    authMiddleware,
    [param('id').isInt({ min: 1 })],
    validate,
    asyncHandler(articleController.deleteArticle)
  );

router.post(
  '/:id/like',
  authMiddleware,
  [param('id').isInt({ min: 1 })],
  validate,
  asyncHandler(articleController.toggleLike)
);

export default router;
