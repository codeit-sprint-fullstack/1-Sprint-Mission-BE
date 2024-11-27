import { Request, Response, NextFunction } from "express";

import productService from "../services/product-service";

import {
  ProductCreateData,
  ProductListQuery,
  ProductUpdateData,
} from "../types/product-types";

async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, description, price, images, tags }: ProductCreateData =
      req.body;
    const userId: string = res.locals.userId;
    const productInfo = await productService.createProduct({
      userId,
      name,
      description,
      price: Number(price),
      images,
      tags,
    });

    res.status(201).send(productInfo);
  } catch (err) {
    next(err);
  }
}

async function getProductList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { orderBy, page, pageSize, keyword } =
      req.query as unknown as ProductListQuery;
    const productListInfo = await productService.getProductList({
      userId,
      orderBy,
      page,
      pageSize,
      keyword,
    });

    res.status(200).send(productListInfo);
  } catch (err) {
    next(err);
  }
}

async function getProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { productId } = req.params as unknown as { productId: string };
    const productDetailInfo = await productService.getProduct({
      userId,
      productId,
    });

    res.status(200).send(productDetailInfo);
  } catch (err) {
    next(err);
  }
}

async function modifyProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { productId } = req.params as unknown as { productId: string };
    const { name, description, price, images, tags }: ProductUpdateData =
      req.body;
    const productUpdateInfo = await productService.modifyProduct({
      userId,
      productId,
      name,
      description,
      price: Number(price),
      images,
      tags,
    });

    res.status(200).send(productUpdateInfo);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { productId } = req.params as unknown as { productId: string };
    const productDeleteInfo = await productService.deleteProduct(productId);

    res.status(204).send(productDeleteInfo);
  } catch (err) {
    next(err);
  }
}

async function increaseProductFavorite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { productId } = req.params as unknown as { productId: string };
    const productUpdateInfo = await productService.increaseProductFavorite({
      userId,
      productId,
    });

    res.status(200).send(productUpdateInfo);
  } catch (err) {
    next(err);
  }
}

async function decreaseProductFavorite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { productId } = req.params as unknown as { productId: string };
    const productUpdateInfo = await productService.decreaseProductFavorite({
      userId,
      productId,
    });

    res.status(200).send(productUpdateInfo);
  } catch (err) {
    next(err);
  }
}

export default {
  createProduct,
  getProductList,
  getProduct,
  modifyProduct,
  deleteProduct,
  increaseProductFavorite,
  decreaseProductFavorite,
};
