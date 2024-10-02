// middlewares/validateProductFields.js
export const validateProductFields = (req, res, next) => {
  const { name, description, price, tags } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: "상품명은 필수 입력 항목입니다." });
  }

  if (description.length < 10) {
    return res
      .status(400)
      .json({ message: "상품 설명은 최소 10자 이상이어야 합니다." });
  }

  if (!price || isNaN(price) || price <= 0) {
    return res
      .status(400)
      .json({ message: "유효한 가격을 숫자만 입력해주세요." });
  }

  if (!tags || !Array.isArray(tags) || tags.length < 1 || tags.length > 5) {
    return res
      .status(400)
      .json({ message: "태그는 최소 1개, 최대 5개까지 입력 가능합니다." });
  }

  next();
};
