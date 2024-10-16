const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/auth");

router.get("/", productController.getAllProducts);

router.get("/:productId", productController.getProductById);

router.post("/", authMiddleware, productController.createProduct);

router.put("/:productId", authMiddleware, productController.updateProduct);

router.delete("/:productId", authMiddleware, productController.deleteProduct);

module.exports = router;
