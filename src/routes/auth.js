import express from 'express';
import { PrismaClient } from '@prisma/client';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();
const prisma = new PrismaClient();

// 인증된 사용자 정보 조회
router.get('/', authMiddleware, async (req, res) => {
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    nickname: req.user.nickname,
  });
});

export default router;
