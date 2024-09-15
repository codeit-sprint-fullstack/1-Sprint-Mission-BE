import express from "express";
import * as c from "../controllers/commentController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.patch("/:commentId", asyncHandler(c.updateCommentById));
router.delete("/:commentId", asyncHandler(c.deleteCommentById));

export default router;
