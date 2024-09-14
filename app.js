import * as dotenv from "dotenv";
import cors from "cors";

import express from "express";
import { Prisma } from "@prisma/client";

import productRoutes from "./src/routes/productRoutes.js";
import articleRoutes from "./src/routes/articleRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (
    err.name === "StructError" ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    res.status(400).send({ message: err.message });
  } else if (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2025"
  ) {
    res.status(404).send({ message: err.message });
  } else {
    res.status(500).send({ message: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("Server started"));
