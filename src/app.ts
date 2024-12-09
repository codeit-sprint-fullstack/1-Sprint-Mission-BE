import { PORT } from "./env";
import cookieParser from "cookie-parser";
import express from "express";
import articles from "./controllers/articleController";
import comments from "./controllers/commentController";
import products from "./controllers/productController";
import users from "./controllers/userController";
import cors, { CorsOptions } from "cors";
import errorHandler from "./middlewares/errorHandler";

const app = express();

//CORS 설정
const allowedOrigins: string[] = [
  "http://localhost:3001",
  "https://1-sprint-mission-fx6q8tnz1-woohyuntaks-projects.vercel.app",
];
// CORS 설정
const corsOptions: CorsOptions = {
  credentials: true,
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, origin?: string) => void
  ) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin); // 허용
    } else {
      callback(new Error("Not allowed by CORS")); // 허용하지 않음
    }
  },
  exposedHeaders: ["set-cookie"],
};

// Express app에 CORS 적용
app.use(cors(corsOptions));

app.use(express.json()); //json parse
app.use(cookieParser());
app.use("/uploads", express.static("upload")); //서버 파일 접근 엔드포인트

app.use("/articles", articles);
app.use("/comments", comments);
app.use("/products", products);
app.use("/users", users);

app.use(errorHandler); //에러 핸들링 미들웨어

app.listen(PORT || 3000, () => console.log("Server Started"));
