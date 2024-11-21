import { port } from "./config/env";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import articleRouter from "./routers/article-router";
import authRouter from "./routers/auth-router";
import productRouter from "./routers/product-router";
import {
  articleCommentRouter,
  commentRouter,
  productCommentRouter,
} from "./routers/comment-router";
import errorHandler from "./middlewares/error-handler";
import { imageUploader, multerMiddleware } from "./middlewares/img-upload-handler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static("uploads"));

app.use("/article", articleRouter);
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/article", articleCommentRouter);
app.use("/product", productCommentRouter);
app.use("/comment", commentRouter);
app.use("/article", articleRouter);
app.use("product", productRouter);

app.post(
  "/upload-images",
  multerMiddleware, // 파일을 먼저 파싱
  imageUploader,    // S3 업로드 처리
  (req, res) => {
    // 최종적으로 응답을 반환
    res.status(200).json({ imageUrls: req.body.imageUrls });
  }
);

app.use(errorHandler);

app.listen(port || 3001, () => console.log("Server Started"));
