import { Router } from "express";
import asyncHandler from "../asyncHandler.js";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, description, price, tags } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price, tags },
    });
    res.status(201).json(product);
  })
);

export default router;
