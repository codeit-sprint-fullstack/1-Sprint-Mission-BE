import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import prisma from "./models/index.js";

dotenv.config();

const requiredEnvVars = [
  "DATABASE_URL",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);
if (missingEnvVars.length) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running and connected to the database");
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/articles", articleRoutes);
app.use("/", commentRoutes);

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.name = "NotFoundError";
  next(error);
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
};

startServer();

export default app;
