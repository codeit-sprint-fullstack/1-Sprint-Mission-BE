import express from "express";
import productCommentService from "../service/productCommentService.js";

const router = express.Router();
router.post("/:productId", productCommentService);
router.get("/:productId", productCommentService);
router.patch("/:id", productCommentService);
router.delete("/:id", productCommentService);

export default router;
