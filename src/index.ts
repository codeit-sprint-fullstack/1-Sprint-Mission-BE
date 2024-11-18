import express, { Application } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import articleRoutes from "./routes/articleRoutes";
import commentRoutes from "./routes/commentRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import cors, { CorsOptions } from "cors";

dotenv.config();

const app: Application = express();

// const allowedOrigins: string[] = [
//   "https://next-ju-12.d1yscjh5yqgpx3.amplifyapp.com",
//   "http://localhost:3000",
// ];

// const corsOptions: CorsOptions = {
//   credentials: true,
//   origin: function (
//     origin: string | undefined,
//     callback: (err: Error | null, origin?: string) => void
//   ) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, origin); // 허용
//     } else {
//       callback(new Error("Not allowed by CORS")); // 허용하지 않음
//     }
//   },
// };
// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/articles", articleRoutes);
app.use("/", commentRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});

export default app;
