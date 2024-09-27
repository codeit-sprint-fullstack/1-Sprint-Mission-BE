import { PORT } from "./env.js";
import express from "express";
import articles from "./routes/articles.js";
import comments from "./routes/comments.js";
import products from "./routes/products.js";
import users from "./routes/users.js";
import cors from "cors";
import swaggerUi, { specs } from "./swagger.js";
const app = express();

app.use(cors());
app.use(express.json());

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

app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "ValidationError") {
    res.status(400).send({ message: err.message });
  } else {
    res.status(500).send({ message: "internal server error" });
  }
});

app.listen(PORT || 3000, () => console.log("Server Started"));
