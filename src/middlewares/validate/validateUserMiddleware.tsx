import { Request, Response, NextFunction } from 'express';
import { createError } from '../../utils/error';

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, encryptedPassword, nickname } = req.body;

  if (!email || email.trim() === '') {
    createError('이메일은 필수입니다.', 400, 400);

  }

  if (!encryptedPassword || encryptedPassword.trim() === '') {
    createError('비밀번호는 필수입니다.', 400, 400);
  }

  if (!nickname || nickname.trim() === '') {
    createError('닉네임은 필수입니다.', 400, 400);
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, encryptedPassword } = req.body;

  if (!email || email.trim() === '') {
    createError('이메일은 필수입니다.', 400, 400);
  }

  if (!encryptedPassword || encryptedPassword.trim() === '') {
    createError('비밀번호는 필수입니다.', 400, 400);
  }

  next();
};
