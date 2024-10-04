import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import prisma from "./models/index.js";
import productRoutes from "./routes/productRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

// 환경 변수 필수 확인 및 예외 처리
const requiredEnvVars = [
  "DATABASE_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Server is running and connected to the database");
});

// 라우트 설정
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/articles", articleRoutes);
app.use("/", commentRoutes);

// 404 오류 처리 (라우트가 없을 경우)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 전역 오류 처리 미들웨어
app.use((err, req, res) => {
  console.error("Unexpected error occurred:", err);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// 서버 시작 함수
const startServer = async () => {
  try {
    // 데이터베이스 연결 확인
    await prisma.$connect();
    console.log("Database connected successfully");

    // 서버 실행
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

// 서버 시작
startServer();

export default app;
