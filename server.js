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

// Swagger 관련 import
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// __filename과 __dirname 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// CORS 설정
app.use(cors());

// MongoDB 연결
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Swagger 설정
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for your project",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8000}`,
      },
    ],
  },
  apis: ["./api/**/*.js"], // API 문서 주석이 포함된 파일의 경로
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 정적 파일 제공 설정
app.use("/images", express.static(path.join(__dirname, "public/images")));

// 라우터 등록
app.use("/api/products", productRoutes); // 제품 관련 API
app.use("/api/articles", articleRoutes); // 게시글 관련 API
app.use("/api/board/comments", boardCommentRoutes); // 자유게시판 댓글
app.use("/api/market/comments", marketCommentRoutes); // 중고마켓 댓글

app.listen(process.env.PORT || 8000, () => console.log("Server Started"));
