import express from "express";
import {
  attachUserId,
  setUserIdFromToken,
  verifyAccessToken,
  verifyProductAuth,
} from "../middlewares/authorizationMiddleware.js";
import imgUploadHandler from "../middlewares/imgUploadHandler.js";
import validateData from "../middlewares/validateData.js";
import productService from "../services/productService.js";
import commentService from "../services/commentService.js";
import asyncHandler from "../utils/asyncHandler.js";
import prepareProductData from "../utils/product/prepareProductData.js";
import createPostResponse from "../utils/product/createProductResponse.js";
import createCursorResponse from "../utils/createCursorResponse.js";
import checkProductLikeStatus from "../utils/product/checkProductLikeStatus.js";

const productController = express.Router();

productController
  .route("/")
  .get(
    asyncHandler(async (req, res, next) => {
      const products = await productService.getAllByfilter(req.query);
      const count = await productService.countByfilter(req.query);
      const [list, total] = await Promise.all([products, count]);

      return res.send({ total, list });
    })
  )
  .post(
    verifyAccessToken,
    imgUploadHandler,
    validateData.product("post"),
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const { creatData, imagePath } = prepareProductData(req);
      const product = await productService.create(creatData);

      const resBody = createPostResponse(product, imagePath);
      res.status(201).send(resBody);
    })
  );

productController
  .route("/:id")
  .get(
    setUserIdFromToken,
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const { pageSize } = req.query;
      const product = await productService.getById(id);
      const comment = await commentService.getAllByFilter(
        id,
        req.query,
        "product"
      );
      const count = await commentService.countByFilter(id, "product");
      const [data, list, total] = await Promise.all([product, comment, count]);

      const currentPageSize = parseInt(pageSize) || 2;
      const comments = createCursorResponse(list, total, currentPageSize);

      const resBody = {
        product: data,
        comments,
      };

      if (req.body.userId) {
        const isLiked = checkProductLikeStatus(req.body, id);
        const resBodyWithLike = {
          isLiked,
          ...resBody,
        };
        res.send(resBodyWithLike);
      } else {
        res.send(resBody);
      }
    })
  )
  .patch(
    verifyAccessToken,
    verifyProductAuth,
    validateData.product("patch"),
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const product = await productService.update(id, req.body);
      res.status(200).send(product);
    })
  )
  .delete(
    verifyAccessToken,
    verifyProductAuth,
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      await productService.deleteById(id);
      res.sendStatus(204);
    })
  );

export default productController;
