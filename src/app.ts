import { PORT } from "./env";
import cookieParser from "cookie-parser";
import express from "express";
import articles from "./controllers/articleController";
import comments from "./controllers/commentController";
import products from "./controllers/productController";
import users from "./controllers/userController";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";

const app = express();

//CORS 설정
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001",
    exposedHeaders: ["set-cookie"],
  })
);

app.use(express.json()); //json parse
app.use(cookieParser());
app.use("/uploads", express.static("upload")); //서버 파일 접근 엔드포인트

app.use("/articles", articles);
app.use("/comments", comments);
app.use("/products", products);
app.use("/users", users);

app.use(errorHandler); //에러 핸들링 미들웨어

app.listen(PORT || 3000, () => console.log("Server Started"));
