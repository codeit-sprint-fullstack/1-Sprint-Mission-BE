import express from "express";
import imgUploadHandler from "../middlewares/imgUploadHandler.js";
import validateData from "../middlewares/validateData.js";
import productService from "../services/productService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  attachUserId,
  setUserIdFromToken,
  verifyAccessToken,
} from "../middlewares/authorizationMiddleware.js";
import commentService from "../services/commentService.js";
import likeService from "../services/likeService.js";

const productController = express.Router();

productController.route("/").post(
  verifyAccessToken,
  imgUploadHandler,
  validateData.product("post"),
  attachUserId,
  asyncHandler(async (req, res, next) => {
    let creatData = {};
    let imagePath = {};
    let product;

    if (req.files && req.files.length > 0) {
      creatData = { ...req.body, image: req.files };
      product = await productService.create(creatData);

      req.files.map((file) => {
        imagePath[file.originalname] = file.path;
      });
    } else {
      creatData = { ...req.body, image: [] };
      product = await productService.create(creatData);
    }

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
);

productController.route("/:id").get(
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
);

export default productController;
