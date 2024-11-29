import { Request, Response, NextFunction } from "express";

export const getUserById = async (
  req: Request & {
    user?: {
      id: number;
      email: string;
      nickname: string;
      image: string;
      createdAt: Date;
      updatedAt: Date;
    };
  },
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { id, email, nickname, image, createdAt, updatedAt } = req.user;

    const userData = { id, email, nickname, image, createdAt, updatedAt };

    return res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};
