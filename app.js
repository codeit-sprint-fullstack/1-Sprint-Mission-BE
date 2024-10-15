import { PORT } from "./env.js";
import cookieParser from "cookie-parser";
import express from "express";
import articles from "./routes/articles.js";
import comments from "./routes/comments.js";
import products from "./routes/products.js";
import users from "./routes/users.js";
import cors from "cors";
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
app.use("/uploads", express.static("upload"));

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/articles", articles);

app.use("/comments", comments);
app.use("/products", products);
app.use("/users", users);

app.use(errorHandler);

app.listen(PORT || 3000, () => console.log("Server Started"));
