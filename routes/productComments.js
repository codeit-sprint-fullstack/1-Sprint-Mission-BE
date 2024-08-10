import express from "express";
import createProductComment from "./productCommentsCRUD/createProductComment.js";
import getProductComments from "./productCommentsCRUD/getProductComment.js";
import updateProductComment from "./productCommentsCRUD/updateProductComment.js";
import deleteProductComment from "./productCommentsCRUD/deleteProductComment.js";

const router = express.Router();
router.post("/:mongoProductId/comments", createProductComment);
router.get("/:mongoProductId/comments", getProductComments);
router.patch("/:mongoProductId/comments/:id", updateProductComment);
router.delete("/:mongoProductId/comments/:id", deleteProductComment);

export default router;
