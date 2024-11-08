import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import articleRpository from "./repositories/article-repository";
import articleRouter from "./routers/article-router";
import authRouter from "./routers/auth-router";
import productRouter from "./routers/product-router";
import { articleCommentRouter, productCommentRouter } from "./routers/comment-router";
// import {
//   commentController,
// } from "./src/controllers/commentController.js";
// import {
//   articleLikeController,
//   productLikeController,
// } from "./src/controllers/likeController.js";
// import productController from "./src/controllers/productController.js";
// import errorHandler from "./src/middlewares/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/images", express.static("uploads"));
// app.post("/", async (req, res, next) => {
//   const data = {
//     title: "s",
//     content: "s",
//     userId: "68b138d3-5731-4df4-9ca3-d88206bc800b",
//   };

//   const select = {
//     id: true,
//     user: {
//         select: {
//             nickname: true,
//             id: true
//         }
//     }
//   };

//   const q = await articleRpository.findFirstData({ where });
//   res.send(q);
// });

app.use("/article", articleRouter);
app.use("/auth", authRouter);
app.use("/product", productRouter);
app.use("/article", articleCommentRouter);
app.use('/product', productCommentRouter)
// app.use("/comment", commentController);
// app.use("/article", articleLikeController);
// app.use("/product", productLikeController);

// app.use(errorHandler);

app.listen(process.env.PORT || 3001, () => console.log("Server Started"));
