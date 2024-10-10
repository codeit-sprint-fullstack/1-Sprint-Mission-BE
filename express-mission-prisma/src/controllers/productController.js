import express from "express";
import imgUploadHandler from "../middlewares/imgUploadHandler.js";
import validateData from "../middlewares/validateData.js";
import productService from "../services/productService.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  attachUserId,
  verifyAccessToken,
} from "../middlewares/authorizationMiddleware.js";

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
  
)

export default productController;
