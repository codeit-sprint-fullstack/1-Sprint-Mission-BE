// app.js

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import { prisma } from "./utils/prisma.js";

dotenv.config();

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(morgan("dev")); // HTTP 요청 로깅

// 라우트 설정 (api 접두사 제거)
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/comments", commentRoutes);
app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.use("/images", imageRoutes);

// 에러 처리 미들웨어
app.use(errorHandler);

// Prisma 연결 테스트
prisma
  .$connect()
  .then(() => console.log("데이터베이스에 연결되었습니다."))
  .catch((err) => console.error("데이터베이스 연결 오류:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
  console.log("환경:", process.env.NODE_ENV);
});

// 라우트 디버깅을 위한 로그
app._router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log(`라우트 등록: ${Object.keys(r.route.methods)} ${r.route.path}`);
  }
});

// 미들웨어 디버깅을 위한 로그
console.log("등록된 미들웨어:");
app._router.stack.forEach((middleware, i) => {
  console.log(`${i}:`, middleware.name);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

export default app;
