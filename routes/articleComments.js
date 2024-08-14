import express from "express";
import articleCommentService from "../service/articleCommentService.js";

const router = express.Router();
router.post("/:articleId", articleCommentService);
router.get("/:articleId", articleCommentService);
router.patch("/:id", articleCommentService);
router.delete("/:id", articleCommentService);

export default router;
