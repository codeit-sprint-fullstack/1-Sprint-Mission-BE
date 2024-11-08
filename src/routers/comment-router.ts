import express from "express";
import commentController from "../controllers/comment-controller";
import { attachUserId, verifyAccessToken } from "../middlewares/authorization";
import validateData from "../middlewares/validate-data";

const commentRouter = express.Router(); // 수정 및 삭제를 위한 router
const articleCommentRouter = express.Router(); // 게시글 댓글 router
const productCommentRouter = express.Router(); // 상품 댓글 router

articleCommentRouter
  .route("/:id/commnet")
  .get(commentController.getCommentListByArticle)
  .post(
    verifyAccessToken,
    validateData.comment("post", "article"),
    attachUserId,
    commentController.createArticleComment
  );

export { articleCommentRouter };
