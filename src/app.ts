import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import errorHandler from "./middlewares/errorHandler";
import productRoutes from "./routes/productRoutes";
import articleRoutes from "./routes/articleRoutes";
import commentRoutes from "./routes/commentRoutes";
import likeRoutes from "./routes/likeRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import imageRoutes from "./routes/imageRoutes";

dotenv.config();
const app = express();

const uploadPath = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN || "", "http://localhost:3000"],
    credentials: true, // 쿠키와 인증 헤더 허용
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/products", productRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/images", imageRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("해당 리소스를 찾을 수 없습니다.") as any;
  error.status = 404;
  next(error);
});

app.use(errorHandler);


export default app;
