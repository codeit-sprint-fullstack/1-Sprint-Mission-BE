// authController.js

import * as authService from '../services/authService.js';
import { UnauthorizedError } from '../middlewares/errorMiddleware.js';

export const signUp = async (req, res, next) => {
  try {
    // 요청 시작 로그
    console.log('signUp 요청 시작:', req.body);

    const user = await authService.signUp(req.body);

    // 성공 로그
    console.log('signUp 성공:', user);

    res.status(201).json({ message: '회원가입이 완료되었습니다.', user });
  } catch (error) {
    // 에러 로그
    console.error('signUp 에러:', error);
    next(error); // 에러를 에러 핸들러로 전달
  }
};

export const signIn = async (req, res, next) => {
  try {
    // 요청 시작 로그
    console.log('signIn 요청 시작:', req.body);

    const { email, password } = req.body;
    const result = await authService.signIn(email, password);

    if (!result) {
      // 실패 로그
      console.error('signIn 실패: 인증 실패');
      throw new UnauthorizedError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 성공 로그
    console.log('signIn 성공:', result);

    res.json({
      message: '로그인 성공',
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (error) {
    // 에러 로그
    console.error('signIn 에러:', error);
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    // 요청 시작 로그
    console.log('refreshToken 요청 시작:', req.body);

    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);

    if (!result) {
      // 실패 로그
      console.error('refreshToken 실패: 유효하지 않은 토큰');
      throw new UnauthorizedError('유효하지 않은 리프레시 토큰입니다.');
    }

    // 성공 로그
    console.log('refreshToken 성공:', result);

    res.json(result);
  } catch (error) {
    // 에러 로그
    console.error('refreshToken 에러:', error);
    next(error);
  }
};
