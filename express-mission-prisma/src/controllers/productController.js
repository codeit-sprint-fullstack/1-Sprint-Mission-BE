import express from "express";
import imgUploadHandler from "../middlewares/imgUploadHandler.js";
import validateData from "../middlewares/validateData.js";
import productService from "../services/productService.js";
import asyncHandler from "../services/errorService.js";

const productController = express.Router();

productController.route("/").post(
  imgUploadHandler,
  validateData.product("post"),
  asyncHandler(async (req, res, next) => {
    const product = await productService.create(req.body);
    const path = {};
    if (req.files && req.files.length > 0) {
      req.files.map((file) => {
        path[file.originalname] = file.path;
      });
    }

    res.status(201).send({product, path});
  })
);

export default productController;
