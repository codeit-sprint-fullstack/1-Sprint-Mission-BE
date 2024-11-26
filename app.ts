import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import productRoutes from "./routes/products.js";
import uploadRoutes from "./routes/uploads.js";
import authRoutes from "./routes/auth.js";

const app: Application = express();
const port = parseInt(process.env.PORT || "3000", 10);

app.use(express.json());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://your-frontend-domain.com"
        : "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use("/products", productRoutes);
app.use("/upload", uploadRoutes);
app.use("/auth", authRoutes);

app.listen(port, "0.0.0.0", () =>
  console.log(`Server is running on port ${port}`)
);
