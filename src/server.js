import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { signup, login } from "./controllers/authController.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", signup);
app.use("/auth", login);

app.use((req, res, next) => {
  res.status(404).json({ message: "Not Found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
