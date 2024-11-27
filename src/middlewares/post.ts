import { Request, Response, NextFunction } from "express";

import postRepository from "../repositories/post-repository";
import { CustomError } from "../utils/error";

export async function isAuthorizedPostIdParam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { postId } = req.params as unknown as { postId: string };
    const where = { id: postId };
    const postInfo = await postRepository.findUniqueOrThrowData({ where });

    if (postInfo.userId !== userId) {
      throw new CustomError(40301);
    }

    next();
  } catch (err) {
    next(err);
  }
}
