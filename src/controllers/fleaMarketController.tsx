import * as fleaMarketService from '../services/fleaMarketService.js';
import { Request, Response, NextFunction } from 'express';
import {
  FleaMarketValues,
  FleaMarketArticle,
} from '../services/fleaMarketService.js';
import { createError } from '../utils/error';

export const getFleaMarket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 5, keyword = '', sort = 'recent' } = req.query;
    const { userId } = req.body;

    const data = await fleaMarketService.getFleaMarket({
      page,
      limit,
      keyword,
      sort,
      userId,
    } as FleaMarketValues);

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getFleaMarketDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const data = await fleaMarketService.getFleaMarketDetail(id, userId);

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const postFleaMarket = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.auth) {
      return createError('Authentication required', 401, 401);
    }

    const { price, title, content, tags } = req.body;
    const userId: any = req.auth.userId;

    const data = await fleaMarketService.postFleaMarket({
      title,
      content,
      price,
      tags,
      userId,
      req,
    } as FleaMarketArticle);

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const editFleaMarket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { price, title, content, tags } = req.body;

    const data = await fleaMarketService.editFleaMarket({
      title,
      content,
      price,
      tags,
      id,
      req,
    } as FleaMarketArticle);

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFleaMarket = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await fleaMarketService.deleteFleaMarket(id);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
