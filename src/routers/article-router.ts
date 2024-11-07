import express from "express";
import articleControler from "../controllers/article-controler";
import {
  attachUserId,
  setUserIdFromToken,
  verifyAccessToken,
} from "../middlewares/authorization";
import validateData from "../middlewares/validate-data";

const articleRouter = express.Router();

articleRouter
  .route("/")
  .get(articleControler.getArticleList)
  .post(
    verifyAccessToken,
    validateData.article("post"),
    attachUserId,
    articleControler.createArticle
  );

articleRouter
  .route("/:id")
  .get(setUserIdFromToken, articleControler.getArticleDetail);

export default articleRouter;
