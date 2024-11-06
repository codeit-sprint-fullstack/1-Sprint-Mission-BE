import { Request, Response, NextFunction, RequestHandler } from "express";

export const asyncHandle =
  (
    handle: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ): RequestHandler =>
  (req, res, next) => {
    handle(req, res, next).catch(next); // 비동기 함수의 오류를 next로 전달
  };
