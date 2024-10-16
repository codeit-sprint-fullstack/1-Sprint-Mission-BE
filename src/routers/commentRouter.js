import express from 'express';
import validateUuid from '../middlewares/validateUuid.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import * as controller from '../controllers/commentController.js';
import { authentication, commentAuthorization } from '../middlewares/auth.js';

const router = express.Router();

router.use('/comments', authentication);

router.get(
  '/products/:productId/comments',
  validateUuid,
  asyncHandler(controller.getCommentList)
);
router.post(
  '/products/:productId/comments',
  validateUuid,
  asyncHandler(controller.createComment)
);

router.get(
  '/articles/:articleId/comments',
  validateUuid,
  asyncHandler(controller.getCommentList)
);
router.post(
  '/articles/:articleId/comments',
  validateUuid,
  asyncHandler(controller.createComment)
);

router.patch(
  '/comments/:commentId',
  validateUuid,
  commentAuthorization,
  asyncHandler(controller.updateCommentById)
);
router.delete(
  '/comments/:commentId',
  validateUuid,
  commentAuthorization,
  asyncHandler(controller.deleteCommentById)
);

export default router;
