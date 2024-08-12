import express from "express";
import createProductComment from "./productCommentsCRUD/createProductComment.js";
import getProductComments from "./productCommentsCRUD/getProductComment.js";
import updateProductComment from "./productCommentsCRUD/updateProductComment.js";
import deleteProductComment from "./productCommentsCRUD/deleteProductComment.js";

const router = express.Router();
router.post("/:productId", createProductComment);
router.get("/:productId", getProductComments);
router.patch("/:id", updateProductComment);
router.delete("/:id", deleteProductComment);

export default router;
