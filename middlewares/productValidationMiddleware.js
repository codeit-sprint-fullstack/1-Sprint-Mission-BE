// 상품 등록 시 필요한 필드(이름, 설명, 가격 등)의 유효성을 검증하는 미들웨어

export const validateProduct = (req, res, next) => {
  const { name, description, price, tags } = req.body;

  // 필수 필드 확인
  if (!name || !description || !price) {
    return res
      .status(400)
      .send({ error: "상품 이름, 설명, 가격은 필수입니다." });
  }

  // 상품명 유효성 검사
  if (name.length < 1 || name.length > 10) {
    return res
      .status(400)
      .send({ error: "상품명은 1자 이상 10자 이내로 입력해야 합니다." });
  }

  // 설명 유효성 검사
  if (description.length < 10 || description.length > 100) {
    return res
      .status(400)
      .send({ error: "상품 소개는 10자 이상 100자 이내로 입력해야 합니다." });
  }

  // 가격 유효성 검사
  if (isNaN(price) || price <= 0) {
    return res.status(400).send({ error: "가격은 0원 이상이어야 합니다." });
  }

  // 태그 유효성 검사 (선택 사항)
  if (tags && tags.length > 5) {
    return res
      .status(400)
      .send({ error: "태그는 5개 이하로 입력해야 합니다." });
  }

  next(); // 다음 미들웨어로 진행
};
