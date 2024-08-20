import mongoose from "mongoose";
import { MONGO_DATABASE_URL, PORT } from "./env.js";
import express from "express";
import articles from "./routes/articles.js";
import comments from "./routes/comments.js";
import products from "./routes/products.js";
import users from "./routes/users.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_DATABASE_URL)
  .then(() => console.log("Connected to MongoDB"));

app.use("/articles", articles);
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

app.listen(PORT, () => console.log("Server Started"));
