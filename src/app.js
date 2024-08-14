import express from "express";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import cors from "cors";
import productRoute from "./route/products.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("default path");
});

app.use("/products", productRoute);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to DB"));
