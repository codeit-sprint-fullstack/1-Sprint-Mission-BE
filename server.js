import dotenv from "dotenv";
dotenv.config(); // 환경 변수 설정

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./api/products/productRoutes.js";
import articleRoutes from "./api/articles/articleRoutes.js";
import boardCommentRoutes from "./api/comments/boardCommentRoutes.js";
import marketCommentRoutes from "./api/comments/marketCommentRoutes.js";

// __filename과 __dirname 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// cors 설정( 일단, 모든 도메인에서의 요청을 허용해놓음 )
app.use(cors());

// MongoDB 연결
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// 정적 파일 제공 설정
app.use("/images", express.static(path.join(__dirname, "public/images")));

// 라우터 등록
app.use("/api/products", productRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/board/comments", boardCommentRoutes);
app.use("/api/market/comments", marketCommentRoutes);

app.listen(process.env.PORT || 8000, () => console.log("Server Started"));
