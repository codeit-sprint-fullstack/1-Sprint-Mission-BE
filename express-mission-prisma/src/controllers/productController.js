import express from "express";
import imgUploadHandler from "../middlewares/imgUploadHandler.js";
import validateData from "../middlewares/validateData.js";
import productService from "../services/productService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  attachUserId,
  setUserIdFromToken,
  verifyAccessToken,
  verifyProductAuth,
} from "../middlewares/authorizationMiddleware.js";
import commentService from "../services/commentService.js";
import likeService from "../services/likeService.js";
import prepareProductData from "../utils/prepareProductData.js";

const productController = express.Router();

productController
  .route("/")
  .post(
    verifyAccessToken,
    imgUploadHandler,
    validateData.product("post"),
    attachUserId,
    asyncHandler(async (req, res, next) => {
      const { creatData, imagePath } = prepareProductData(req);
      const product = await productService.create(creatData);

      const resBody = {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          tags: product.tags,
          userId: product.userId,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
        imagePath,
      };

      res.status(201).send(resBody);
    })
  )
  .get(
    asyncHandler(async (req, res, next) => {
      const products = await productService.getAllByFillter(req.query);
      const count = await productService.countByFillter(req.query);
      const [list, total] = await Promise.all([products, count]);

      return res.send({ total, list });
    })
  );

productController
  .route("/:id")
  .get(
    setUserIdFromToken,
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const product = await productService.getById(id);
      const comment = await commentService.getAllByFilter(
        id,
        req.query,
        "product"
      );
      const count = await commentService.countByFilter(id, "product");
      const [data, list, total] = await Promise.all([product, comment, count]);

      const lastList = list[2];
      const NextCusor = lastList ? lastList.id : "null";
      if (NextCusor !== "null") {
        list.pop();
      }

      const resBody = {
        product: data,
        comments: {
          cursorInfo: {
            total,
            NextCusor,
          },
          list,
        },
      };

      if (req.body.userId) {
        req.body.productId = id;
        const like = await likeService.getByFillter(req.body, "product");
        let isLiked;
        if (like) {
          isLiked = true;
        } else if (!like) {
          isLiked = false;
        }
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
