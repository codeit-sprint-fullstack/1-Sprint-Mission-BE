import express from "express";
import articleRoutes from "./routes/articleRoutes.js";
import articleCommentRoutes from "./routes/articleCommentRoutes.js";
import marketCommentRoutes from "./routes/marketCommentRoutes.js";
import marketItemRoutes from "./routes/marketItemRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

// 게시글 관련 라우트
app.use("/api/articles", articleRoutes);

// 게시글 댓글 관련 라우트
app.use(
  "/api/articles/:articleId/comments",
  (req, res, next) => {
    req.articleId = req.params.articleId; // articleId를 저장
    next();
  },
  articleCommentRoutes
);

// 중고템 관련 라우트
app.use("/api/market-items", marketItemRoutes);

// 중고템 댓글 관련 라우트
app.use(
  "/api/market-items/:marketItemId/comments",
  (req, res, next) => {
    req.marketItemId = req.params.marketItemId;
    next();
  },
  marketCommentRoutes
);

// 에러 핸들러
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Port : ${PORT} 에서 서버가 실행중입니다.`);
});
