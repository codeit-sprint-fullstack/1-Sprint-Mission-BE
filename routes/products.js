import express from "express";
import createProduct from "./createProduct.js";
import getProducts from "./getProducts.js";
import updateProduct from "./updateProduct.js";
import deleteProduct from "./deleteProduct.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
