import { NextFunction, Request, Response } from "express";
import { CreateArticleLike } from "../struct/like-struct";
import likeService from "../services/like-service";
import { UserId } from "../types/service-type";

async function createArticleLike(
  req: Request<{}, {}, UserId & CreateArticleLike>,
  res: Response,
  next: NextFunction
) {
  try {
    const like = await likeService.createArticleLike(req.body);
    res.status(201).send(like);
  } catch (err) {
    return next(err);
  }
}

async function deleteArticleLike(
  req: Request<{ id: string }, {}, { userId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id: articleId } = req.params;
    const { userId } = req.body;
    const like = await likeService.deleteArticleLike(articleId, userId);

    res.send(like);
  } catch (err) {
    return next(err);
  }
}

export default {
  createArticleLike,
  deleteArticleLike,
};
