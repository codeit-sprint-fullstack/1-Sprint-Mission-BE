import { Response, Request, NextFunction } from "express";

export const validateProductFields = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { name, description, price, tags } = req.body;

  if (!name || name.trim().length === 0) {
    res.status(400).json({ message: "상품명은 필수 입력 항목입니다." });
    return;
  }

  if (!description || description.length < 10) {
    res
      .status(400)
      .json({ message: "상품 설명은 최소 10자 이상이어야 합니다." });
    return;
  }

  if (typeof parseInt(price) !== "number" || parseInt(price) < 0) {
    res.status(400).json({ message: "유효한 가격을 숫자만 입력해주세요." });
    return;
  }

  if (typeof tags === "string") {
    try {
      tags = JSON.parse(tags);
    } catch (error) {
      res
        .status(400)
        .json({ message: "태그는 최소 1개, 최대 5개까지 입력 가능합니다." });
      return;
    }
  }

  if (!Array.isArray(tags) || tags.length < 1 || tags.length > 5) {
    res
      .status(400)
      .json({ message: "태그는 최소 1개, 최대 5개까지 입력 가능합니다." });
    return;
  }

  req.body.tags = tags;
  next();
};
