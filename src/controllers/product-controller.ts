import { NextFunction, Request, Response } from "express";
import { PagenationQuery } from "../types/service-type";
import productService from "../services/product-service";

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

  export default {
    getProductList
  }