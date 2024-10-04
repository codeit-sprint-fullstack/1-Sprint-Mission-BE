import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 정적 파일 제공 설정: /uploads 경로에서 파일을 서빙
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 기타 설정 및 라우트
app.use(cors());
app.use(express.json());

// 라우트 설정
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/articles", articleRoutes);
app.use("/", commentRoutes);

// 에러 처리 미들웨어 설정
app.use(errorHandler);

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
