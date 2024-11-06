import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import articleRpository  from "./repositories/article-repository";
// import articleController from "./src/controllers/articleController.js";
// import authController from "./src/controllers/authController.js";
// import {
//   articleCommentController,
//   commentController,
//   productCommentController,
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

// app.use("/article", articleController);
// app.use("/auth", authController);
// app.use("/comment", commentController);
// app.use("/article", articleCommentController);
// app.use("/product", productCommentController);
// app.use("/article", articleLikeController);
// app.use("/product", productLikeController);
// app.use("/product", productController);

// app.use(errorHandler);

app.listen(process.env.PORT || 3001, () => console.log("Server Started"));
