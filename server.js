import dotenv from "dotenv";
dotenv.config(); // 환경 변수 설정

import express from "express";
import cors from "cors";
import session from "express-session"; // Passport 초기화
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/products/productRoutes.js"; // 제품 관련 API import
import articleRoutes from "./routes/articles/articleRoutes.js"; // 게시글 관련 API import
import boardCommentRoutes from "./routes/comments/boardCommentRoutes.js"; // 자유게시판 댓글 API import
import marketCommentRoutes from "./routes/comments/marketCommentRoutes.js"; // 중고마켓 댓글 API import
import { PrismaClient } from "@prisma/client"; // Prisma Client import
import userRoutes from "./routes/user.js"; // 사용자 관련 API import
import passport from "passport"; // passport import
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// __filename과 __dirname 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json()); // JSON 형식의 요청 본문을 파싱

// CORS 설정
app.use(
  cors({
    origin: "http://localhost:3000", // 프론트엔드 URL
    credentials: true,
  })
);

// Prisma Client 생성
const prisma = new PrismaClient();

// PostgreSQL 연결
(async () => {
  try {
    await prisma.$connect(); // 데이터베이스에 연결
    console.log("PostgreSQL Connected");
  } catch (err) {
    console.error("PostgreSQL connection error:", err);
  }
})();

// 세션 설정
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-key", // 비밀 키
    resave: false,
    saveUninitialized: true,
  })
);

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session()); // 세션 관리

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
        url: `http://localhost:${process.env.PORT || 8000}`, // 서버 URL 설정
      },
    ],
  },
  apis: ["./api/**/*.js"], // API 문서 주석이 포함된 파일의 경로
};

const swaggerDocs = swaggerJsDoc(swaggerOptions); // Swagger 문서 생성
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Swagger UI 설정

// 정적 파일 제공 설정
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // 이미지 파일 제공

// 라우터 등록
app.use("/api/products", productRoutes); // 제품 관련 API
app.use("/api/articles", articleRoutes); // 게시글 관련 API
app.use("/api/board/comments", boardCommentRoutes); // 자유게시판 댓글
app.use("/api/market/comments", marketCommentRoutes); // 중고마켓 댓글
app.use("/api/users", userRoutes); // 사용자 관련 API 추가

app.listen(process.env.PORT || 8000, () => console.log("Server Started")); // 서버 시작
