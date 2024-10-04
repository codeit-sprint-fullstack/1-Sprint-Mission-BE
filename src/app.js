import dotenv from "dotenv";
import express from "express";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import prisma from "./config/database.js";
import articleRoutes from "./routes/articleRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/", commentRoutes);
app.use("/auth", authRoutes);
app.use("/articles", articleRoutes);
app.use("/images", imageRoutes);

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Prisma 연결 테스트
prisma
  .$connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error", err));

export default app;
