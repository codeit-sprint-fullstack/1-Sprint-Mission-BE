// src/index.js
import express from "express";
import articleRoutes from "./routes/articleRoutes.js";
import commentRoutes from "./routes/marketCommentRoutes.js";
import marketItemRoutes from "./routes/marketItemRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json());

app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/market-items", marketItemRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
