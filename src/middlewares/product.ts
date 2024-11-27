import { Request, Response, NextFunction } from "express";

import productRepository from "../repositories/product-repository";
import { CustomError } from "../utils/error";

export async function isAuthorizedProductIdParam(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { productId } = req.params as unknown as { productId: string };
    const where = { id: productId };
    const productInfo = await productRepository.findUniqueOrThrowData({
      where,
    });

    if (productInfo.userId !== userId) {
      throw new CustomError(40302);
    }

    next();
  } catch (err) {
    next(err);
  }
}
