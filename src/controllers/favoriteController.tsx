import * as favoriteService from '../services/favoriteService.js';
import { Request, Response, NextFunction } from 'express';

export const postFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleCategory, articleId } = req.params;
    const { userId } = req.auth || {};

    await favoriteService.postFavorite({ articleCategory, articleId, userId });
    res.status(200).json({ message: '좋아요가 추가되었습니다.' });
  } catch (error) {
    next(error);
  }
};

export const deleteFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleCategory, articleId } = req.params;
    const { userId } = req.auth || {};

    await favoriteService.deleteFavorite({
      articleCategory,
      articleId,
      userId,
    });
    res.status(204).json({ message: '좋아요가 삭제됐습니다.' });
  } catch (error) {
    next(error);
  }
};
