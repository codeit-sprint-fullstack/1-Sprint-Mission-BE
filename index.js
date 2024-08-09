import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import articleRoutes from "./routes/articles.js";
import commentRoutes from "./routes/articleComments.js";
import productCommentRoutes from "./routes/productComments.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/articles", articleRoutes);
app.use("/articleComments", commentRoutes);
app.use("/api", productCommentRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
