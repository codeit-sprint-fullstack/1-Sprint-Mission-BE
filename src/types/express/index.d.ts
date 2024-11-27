import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number }; // 사용자 정보를 담기 위한 속성
    }
  }
}

