import express from "express";
import productController from "../controllers/product-controller";

const productRouter = express.Router();

productRouter.route("/").get(productController.getProductList);

export default productRouter;
