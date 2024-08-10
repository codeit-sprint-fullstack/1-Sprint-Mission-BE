import express from "express";
import dotenv from "dotenv";
import articleRoutes from "./routes/articles.js";
import commentRoutes from "./routes/articleComments.js";
import products from "./routes/products.js";
import productCommentRoutes from "./routes/productComments.js";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/articles", articleRoutes);
app.use("/articleComments", commentRoutes);
app.use("/productComments", productCommentRoutes);
app.use("/products", products);

const mongoURI = process.env.MONGO_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
export default app;
