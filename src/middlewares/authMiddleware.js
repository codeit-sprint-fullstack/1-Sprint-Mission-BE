import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./errorMiddleware.js";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new UnauthorizedError("인증이 필요합니다.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new UnauthorizedError("유효하지 않은 토큰입니다.");
  }
};

export default authMiddleware;
