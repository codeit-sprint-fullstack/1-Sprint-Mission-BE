import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import axios from "axios";
import productsRoutes from "./routes/productsRotues.js";
import commentsRoutes from "./routes/commentsRotues.js";
import articleRoutes from "./routes/articleRotues.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", userRoutes); //유저 회원가입, 로그인

app.use("/products", productsRoutes, commentsRoutes);
app.use("/article", articleRoutes);
app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
