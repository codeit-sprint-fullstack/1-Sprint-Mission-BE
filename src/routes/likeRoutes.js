// likeRoutes.js

import express from 'express';
import * as likeController from '../controllers/likeController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:itemType/:itemId', authMiddleware, likeController.toggleLike);

export default router;
