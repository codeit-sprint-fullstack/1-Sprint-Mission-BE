// commentRoutes.js

import express from 'express';
import { body, param } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middlewares/validate.js';
import * as commentController from '../controllers/commentController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('content').isString().notEmpty(),
    body('productId').optional().isInt({ min: 1 }),
    body('articleId').optional().isInt({ min: 1 }),
  ],
  validate,
  asyncHandler(commentController.createComment)
);

router
  .route('/:id')
  .put(
    authMiddleware,
    [param('id').isInt({ min: 1 }), body('content').isString().notEmpty()],
    validate,
    asyncHandler(commentController.updateComment)
  )
  .delete(
    authMiddleware,
    [param('id').isInt({ min: 1 })],
    validate,
    asyncHandler(commentController.deleteComment)
  );

export default router;
