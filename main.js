import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { DATABASE_URL, PORT } from "./env.js";
import productRoutes from "./routes/productRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

// Express
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Failed to connect to DB", err));

// 라우터 땡겨오기
app.use(productRoutes);

// 에러 처리 미들웨어
app.use(errorHandler);

// 서버 열기
app.listen(PORT, () => console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`));
