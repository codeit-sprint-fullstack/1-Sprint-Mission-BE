import * as commentService from '../services/commentService.js';
import { Request, Response, NextFunction } from 'express';
import { CommentsValues } from '../services/commentService.js';

export const getComments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cursor, limit } = req.query;
    const { articleId, articleCategory } = req.params;

    const data = await commentService.getComments({
      cursor,
      limit,
      articleId,
      articleCategory,
    } as CommentsValues);

    res.status(200).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const postComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { articleId, articleCategory } = req.params;
    const { userId } = req.auth || {};
    const { content } = req.body;

    const data = await commentService.postComment({
      articleId,
      articleCategory,
      content,
      userId,
    });

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const editComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const data = await commentService.editComment(id, content);

    res.status(201).json({
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await commentService.deleteComment(id);

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
