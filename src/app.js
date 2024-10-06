import * as dotenv from "dotenv";
import cors from "cors";
import express from "express";
import authRouter from "./routers/authRouter.js";
import productRouter from "./routes/productRouter.js";
import articleRouter from "./routes/articleRouter.js";
import commentRouter from "./routes/commentRouter.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/articles", articleRouter);
app.use("/api", commentRouter);

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log("Server started"));
