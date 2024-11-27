import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "접근이 거부되었습니다." });
    return;
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
    req.user = { id: verified.userId }; // 전역 타입에 저장된 user 정보 가져와서 사용중
    next();
  } catch (error) {
    res.status(401).json({ error: "유효한 토큰이 만료되었습니다." });
  }
};

export default authMiddleware;
