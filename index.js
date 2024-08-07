import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import products from "./routes/products";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // JSON 파싱을 위한 미들웨어 추가

app.use("/products", products);

const mongoURI = process.env.MONGO_URI || "your-mongodb-uri-here";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
