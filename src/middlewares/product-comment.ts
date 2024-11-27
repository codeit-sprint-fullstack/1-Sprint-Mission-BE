import { Request, Response, NextFunction } from "express";

import productCommentRepository from "../repositories/product-comment-repository";
import { CustomError } from "../utils/error";

export async function isAuthorizedProductCommentIdParam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { productCommentId } = req.params as unknown as {
      productCommentId: string;
    };
    const where = { id: productCommentId };
    const productInfo = await productCommentRepository.findUniqueOrThrowData({
      where,
    });

    if (productInfo.userId !== userId) {
      throw new CustomError(40301);
    }

    next();
  } catch (err) {
    next(err);
  }
}
