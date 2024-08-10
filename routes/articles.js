import express from "express";
import createArticle from "./articleCRUD/createArticle.js";
import getArticle from "./articleCRUD/getArticle.js";
import updateArticle from "./articleCRUD/updateArticle.js";
import deleteArticle from "./articleCRUD/deleteArticle.js";

const router = express.Router();
router.post("/", createArticle);
router.get("/", getArticle);
router.get("/:id", getArticle);
router.patch("/:id", updateArticle);
router.delete("/:id", deleteArticle);

export default router;
