import { Request, Response, NextFunction } from 'express';
import { createError } from '../../utils/error';

const validateCommentMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { content } = req.body;

  if (!content || content.trim() === '') {
    {
      createError('내용이 없습니다', 400, 400);
    }
  }

  next();
};

export default validateCommentMiddleware;
