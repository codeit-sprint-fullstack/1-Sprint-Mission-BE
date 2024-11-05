import jwt from "jsonwebtoken";
import prisma from "../models/index.js";
import { Response, Request, NextFunction } from "express";

interface DecodedToken {
  id: number;
  iat?: number;
  exp?: number;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      email: string;
      nickname: string;
    };
  }
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as DecodedToken;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    req.user = { id: user.id, email: user.email, nickname: user.nickname };
    next();
  } catch (error: any) {
    console.error("Error verifying token:", error);

    if (error.name === "TokenExpiredError") {
      res.status(401).json({ message: "Token expired" });
      return;
    }
    res.status(401).json({ message: "Unauthorized" });
  }
};
