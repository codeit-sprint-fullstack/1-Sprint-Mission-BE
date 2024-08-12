import express from 'express';
import * as c from '../controllers/commentController.js';
import { asyncHandler } from '../utils/errorHandler.js';

const router = express.Router();

router.patch('/:id', asyncHandler(c.updateCommentById));
router.delete('/:id', asyncHandler(c.deleteCommentById));

export default router;
