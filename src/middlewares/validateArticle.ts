import { Response, Request, NextFunction } from "express";

export const validateArticle = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { content, title } = req.body;

  if (!title || title.trim().length === 0) {
    res.status(400).json({ message: "게시판 제목은 필수 입력 항목입니다." });
    return;
  }

  if (!content || content.length < 10) {
    res
      .status(400)
      .json({ message: "상품 설명은 최소 10자 이상이어야 합니다." });
    return;
  }

  next();
};
