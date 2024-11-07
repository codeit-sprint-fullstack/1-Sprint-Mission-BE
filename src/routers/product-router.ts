import express from "express";
import productController from "../controllers/product-controller";
import { attachUserId, verifyAccessToken } from "../middlewares/authorization";
import imgUploadHandler from "../middlewares/img-upload-handler";
import validateData from "../middlewares/validate-data";

const productRouter = express.Router();

productRouter
  .route("/")
  .get(productController.getProductList)
  .post(
    verifyAccessToken,
    imgUploadHandler,
    validateData.product("post"),
    attachUserId,
    productController.createProduct
  );

export default productRouter;
