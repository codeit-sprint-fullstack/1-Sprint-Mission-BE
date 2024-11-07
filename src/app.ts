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

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3001",
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("upload"));

app.use("/articles", articles);
app.use("/comments", comments);
app.use("/products", products);
app.use("/users", users);

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log("Server Started"));
