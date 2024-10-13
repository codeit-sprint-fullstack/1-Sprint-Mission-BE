import express from 'express';
import { PrismaClient } from '@prisma/client';
import * as userController from '../controllers/userController.js';
import * as validateUserMiddleware from '../middlewares/validate/validateUserMiddleware.js';
import jwtMiddleware from '../middlewares/jwtMiddleware.js';
import cookieParser from 'cookie-parser';

const router = express.Router();
const prisma = new PrismaClient();

router.use(cookieParser());

// 사용자 ID로 조회, 수정 및 삭제 라우트
router.route('/:id');

// 사용자 조회
router.get('/', userController.getUsers);

router.get('/:id', userController.getUserDetail);

router.patch('/:id', userController.editUser);

router.delete('/:id', userController.deleteUser);

// 리프레시 토큰을 사용한 엑세스토큰 재발급
router.post(
  '/auth/refresh-token',
  jwtMiddleware.verifyRefreshToken,
  userController.updateRefreshToken
);

//로그인
router.post(
  '/auth/login',
  validateUserMiddleware.validateLogin,
  userController.loginUser
);

// 회원가입
router.post(
  '/auth/signup',
  validateUserMiddleware.validateUser,
  userController.createUser
);

export default router;
