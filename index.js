import express from "express";
import cors from "cors";
// import articleRoutes from "./routes/articles.js";
// import commentRoutes from "./routes/articleComments.js";
// import productRoutes from "./routes/products.js";
// import productCommentRoutes from "./routes/productComments.js";
import prisma from "./models/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/check-db", async (req, res) => {
  try {
    await prisma.$connect();
    res.status(200).json({ message: "Database connected successfully" });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ message: "Database connection failed", error });
  } finally {
    await prisma.$disconnect();
  }
});

// app.use("/articles", articleRoutes);
// app.use("/articlecomments", commentRoutes);
// app.use("/products", productRoutes);
// app.use("/productcomments", productCommentRoutes);

export default app;
