import { Request, Response, RequestHandler, NextFunction } from "express";

export const asyncHandle = (
  handle: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<Response | void>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    handle(req, res, next).catch(next); // 비동기 함수에서 발생한 오류를 처리
  };
};
