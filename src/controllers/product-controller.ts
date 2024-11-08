import { NextFunction, Request, Response } from "express";
import { CursorQuery, PagenationQuery } from "../types/service-type";
import productService from "../services/product-service";
import { CreateProduct } from "../struct/product-struct";

export type CreateProductWithUser = CreateProduct & {
  userId: string;
};

// product 목록 조회
async function getProductList(
  req: Request<{}, {}, {}, PagenationQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const productList = await productService.getProductList(req.query);
    res.send(productList);
  } catch (err) {
    return next(err);
  }
}

// product 생성
async function createProduct(
  req: Request<{}, {}, CreateProductWithUser>,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await productService.createProduct(req);
    res.status(201).send(product);
  } catch (err) {
    return next(err);
  }
}

// product 상세 조회
async function getProductDetail(
  req: Request<{ id: string }, {}, { userId: string | null }, CursorQuery>,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await productService.getProductDetail(req);
    res.send(product);
  } catch (err) {
    return next(err);
  }
}

export default {
  getProductList,
  createProduct,
  getProductDetail,
};
