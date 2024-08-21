import express from "express";
import {
  createProductComment,
  getProductComments,
  updateProductComment,
  deleteProductComment,
} from "../service/productCommentService.js";

const router = express.Router();
// http://localhost:5432/productcomments
router.post("/:productId", createProductComment);
router.get("/:productId", getProductComments);
router.put("/:id", updateProductComment);
router.delete("/:id", deleteProductComment);

export default router;
