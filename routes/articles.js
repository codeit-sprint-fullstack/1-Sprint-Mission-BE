import express from "express";
import articleService from "../service/articleService.js";

const router = express.Router();
router.post("/", articleService);
router.get("/", articleService);
router.get("/:id", articleService);
router.patch("/:id", articleService);
router.delete("/:id", articleService);

export default router;
