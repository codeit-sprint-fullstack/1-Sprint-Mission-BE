import express from "express";
import createProduct from "./productCRUD/createProduct.js";
import getProducts from "./productCRUD/getProducts.js";
import updateProduct from "./productCRUD/updateProduct.js";
import deleteProduct from "./productCRUD/deleteProduct.js";

const router = express.Router();
router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProducts);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
