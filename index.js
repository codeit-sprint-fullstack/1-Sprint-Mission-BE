import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import createProduct from "./routes/createProduct.js";
import getProducts from "./routes/getProducts.js";
import updateProduct from "./routes/updateProduct.js";
import deleteProduct from "./routes/deleteProduct.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // JSON 파싱을 위한 미들웨어 추가

app.use("/products", createProduct);
app.use("/products", getProducts);
app.use("/products", updateProduct);
app.use("/products", deleteProduct);

const mongoURI = process.env.MONGO_URI || "your-mongodb-uri-here";

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
