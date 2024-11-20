import { Request } from 'express';

// CustomRequest 타입 정의
export interface CustomRequest extends Request {
  user?: {
    userId: number;
    email: string;
  };
}
