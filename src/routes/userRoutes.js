// userRoutes.js

import express from 'express';
import { getMe } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/me', authenticateToken, getMe);

export default router;
