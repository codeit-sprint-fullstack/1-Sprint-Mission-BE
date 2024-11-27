import { Request, Response, NextFunction } from "express";

import postCommentRepository from "../repositories/post-comment-repository";
import { CustomError } from "../utils/error";

export async function isAuthorizedPostCommentIdParam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { postCommentId } = req.params as unknown as {
      postCommentId: string;
    };
    const where = { id: postCommentId };
    const postInfo = await postCommentRepository.findUniqueOrThrowData({
      where,
      select: { userId: true },
    });

    if (postInfo.userId !== userId) {
      throw new CustomError(40301);
    }

    next();
  } catch (err) {
    next(err);
  }
}
