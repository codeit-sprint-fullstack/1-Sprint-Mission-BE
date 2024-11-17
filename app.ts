import * as dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import productRoutes from "./routes/products";
import uploadRoutes from "./routes/uploads";
import authRoutes from "./routes/auth";

const app: Application = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use("/products", productRoutes);
app.use("/upload", uploadRoutes);
app.use("/auth", authRoutes);

app.listen(process.env.PORT || 3000, () => console.log("Server Started"));
