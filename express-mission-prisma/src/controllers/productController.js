import express from "express";
import imgUploadHandler from "../middlewares/imgUploadHandler.js";
import validateData from "../middlewares/validateData.js";
import productService from "../services/productService.js";
import asyncHandler from "../utils/asyncHandler.js";
import verifyAccessToken from "../middlewares/verifyAccessToken .js";

const productController = express.Router();

productController.route("/").post(
  verifyAccessToken,
  imgUploadHandler,
  validateData.product("post"),
  asyncHandler(async (req, res, next) => {
    let creatData = {};
    let path = {};
    let product;

    if (req.files && req.files.length > 0) {
      creatData = { ...req.body, image: req.files };
      product = await productService.create(creatData);

      req.files.map((file) => {
        path[file.originalname] = file.path;
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
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
      imagePath,
    };

    res.status(201).send(resBody);
  })
);

export default productController;
