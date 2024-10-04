import { PORT } from "./env.js";
import cookieParser from "cookie-parser";
import express from "express";
import articles from "./routes/articles.js";
import comments from "./routes/comments.js";
import products from "./routes/products.js";
import users from "./routes/users.js";
import cors from "cors";
import swaggerUi, { specs } from "./swagger.js";
import errorHandler from "./middlewares/errorHandler.js";

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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/articles", articles);

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: 댓글
 */

app.use("/comments", comments);
app.use("/products", products);
app.use("/users", users);

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log("Server Started"));
