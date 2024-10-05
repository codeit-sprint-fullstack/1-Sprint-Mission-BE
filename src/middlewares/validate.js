// src/middlewares/validate.js
export const validateProductCreation = [
  body("name")
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage("상품명은 1-100자 사이여야 합니다."),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("상품 설명은 필수입니다."),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("가격은 0 이상의 숫자여야 합니다."),
  body("image").isURL().withMessage("유효한 이미지 URL이어야 합니다."),
  // 추가 필드에 대한 유효성 검사
];
