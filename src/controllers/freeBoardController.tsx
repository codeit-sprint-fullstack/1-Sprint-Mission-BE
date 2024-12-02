import * as freeBoardService from '../services/freeBoardService.js';
import { Request, Response, NextFunction } from 'express';
import { FreeBoardValues } from '../services/freeBoardService.js';

export const getFreeBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 5, keyword = '', sort = 'recent' } = req.query;
    const data = await freeBoardService.getFreeBoard({
      page,
      limit,
      keyword,
      sort,
    } as FreeBoardValues);

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getFreeBoardDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const data = await freeBoardService.getFreeBoardDetail(id, userId);

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const postFreeBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, content, tags } = req.body;
    const userId: any = req.auth?.userId;

    const data = await freeBoardService.postFreeBoard(
      title,
      content,
      tags,
      userId
    );

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const editFreeBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const data = await freeBoardService.editFreeBoard(title, content, id);

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFreeBoard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await freeBoardService.deleteFreeBoard(id);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
