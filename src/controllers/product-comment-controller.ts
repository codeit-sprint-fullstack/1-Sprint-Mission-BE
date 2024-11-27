import { Request, Response, NextFunction } from "express";

import productCommentService from "../services/product-comment-service";

import {
  ProductCommentCreateData,
  ProductCommentListQuery,
  ProductCommentUpdateData,
} from "../types/product-comment-types";

async function createProductComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { productId, content }: ProductCommentCreateData = req.body;
    const userId: string = res.locals.userId;
    const productCommentInfo = await productCommentService.createProductComment(
      {
        userId,
        productId,
        content,
      }
    );

    res.status(201).send(productCommentInfo);
  } catch (err) {
    next(err);
  }
}

async function getProductCommentList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { productId } = req.params;
    const { orderBy, page, pageSize } =
      req.query as unknown as ProductCommentListQuery;
    const ProductCommentListInfo =
      await productCommentService.getProductCommentList({
        productId,
        orderBy,
        page,
        pageSize,
      });

    res.status(200).send(ProductCommentListInfo);
  } catch (err) {
    next(err);
  }
}

async function getProductComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { productCommentId } = req.params as unknown as {
      productCommentId: string;
    };
    const productCommentDetailInfo =
      await productCommentService.getProductComment(productCommentId);

    res.status(200).send(productCommentDetailInfo);
  } catch (err) {
    next(err);
  }
}

async function modifyProductComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { productCommentId } = req.params as unknown as {
      productCommentId: string;
    };
    const { content }: ProductCommentUpdateData = req.body;
    const productCommentUpdateInfo =
      await productCommentService.modifyProductComment({
        productCommentId,
        content,
      });

    res.status(200).send(productCommentUpdateInfo);
  } catch (err) {
    next(err);
  }
}

async function deleteProductComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { productCommentId } = req.params as unknown as {
      productCommentId: string;
    };
    const productCommentDeleteInfo =
      await productCommentService.deleteProductComment(productCommentId);

    res.status(204).send(productCommentDeleteInfo);
  } catch (err) {
    next(err);
  }
}

export default {
  createProductComment,
  getProductCommentList,
  getProductComment,
  modifyProductComment,
  deleteProductComment,
};
