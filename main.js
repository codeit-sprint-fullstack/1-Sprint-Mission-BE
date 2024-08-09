import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  origin: process.env.DATABASE_URL,
};
app.use(cors(corsOptions));
app.use(express.json());
const prisma = new PrismaClient();
