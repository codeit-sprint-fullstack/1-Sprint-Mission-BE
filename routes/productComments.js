import express from "express";
import createProductComment from "./productCommentsCRUD/createProductComment.js";
import getProductComments from "./productCommentsCRUD/getProductComment.js";
import updateProductComment from "./productCommentsCRUD/updateProductComment.js";
import deleteProductComment from "./productCommentsCRUD/deleteProductComment.js";

const router = express.Router();
router.post("/:mongoProductId", createProductComment);
router.get("/:mongoProductId", getProductComments);
router.patch("/:mongoProductId/:id", updateProductComment);
router.delete("/:mongoProductId/:id", deleteProductComment);

export default router;
