import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import articleRoutes from "./routes/articles.js";
import commentRoutes from "./routes/articleComments.js";
import productRoutes from "./routes/products.js";
import productCommentRoutes from "./routes/productComments.js";
import cors from "cors";

dotenv.config();

const app = express();
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

app.use(cors());
app.use(express.json());

// 기본 라우트: 서버 상태 확인용
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Prisma Client를 통해 데이터베이스 연결 확인
app.get("/check-db", async (req, res) => {
  try {
    await prisma.$connect();
    res.status(200).json({ message: "Database connected successfully" });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ message: "Database connection failed", error });
  } finally {
    await prisma.$disconnect();
  }
});

app.use("/articles", articleRoutes);
app.use("/articlecomments", commentRoutes);
app.use("/productcomments", productCommentRoutes);
app.use("/products", productRoutes);

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
