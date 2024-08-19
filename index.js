import express from "express";
import articleRoutes from "./routes/articleRoutes.js";
import articleCommentRoutes from "./routes/articleCommentRoutes.js";
import marketCommentRoutes from "./routes/marketCommentRoutes.js";
import marketItemRoutes from "./routes/marketItemRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/articles", articleRoutes);
app.use("/api/market-items", marketItemRoutes);
app.use("/api/articles/:articleId/comments", articleCommentRoutes);
app.use("/api/market-items/:marketItemId/comments", marketCommentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Port : ${PORT} 에서 서버가 실행중입니다.`);
});
