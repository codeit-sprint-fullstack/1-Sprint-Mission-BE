import express from "express";
import articleControler from "../controllers/article-controler";

const articleRouter = express.Router();

articleRouter.route("/").get(articleControler.getArticleList);

export default articleRouter
