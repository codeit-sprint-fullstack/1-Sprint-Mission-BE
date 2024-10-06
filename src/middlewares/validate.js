import { body, param, query, validationResult } from "express-validator";

// 공통 유효성 검사 규칙
const commonRules = {
  id: param("id").isInt({ min: 1 }).withMessage("유효한 ID가 아닙니다."),
  nickname: body("nickname")
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage("닉네임은 1-20자 사이여야 합니다."),
  url: (field) => body(field).isURL().withMessage("유효한 URL이 아닙니다."),
  email: body("email").isEmail().withMessage("유효한 이메일 주소가 아닙니다."),
  password: body("password")
    .isLength({ min: 8 })
    .matches(/^([a-zA-Z0-9!@#$%^&*])+$/)
    .withMessage(
      "비밀번호는 8자 이상이며, 영문, 숫자, 특수문자만 포함해야 합니다."
    ),
};

// 상품 관련 유효성 검사 규칙
export const productRules = {
  create: [
    body("name")
      .isString()
      .isLength({ min: 1, max: 30 })
      .withMessage("상품명은 1-30자 사이여야 합니다."),
    body("description")
      .isString()
      .notEmpty()
      .withMessage("상품 설명은 필수입니다."),
    body("price")
      .isInt({ min: 0 })
      .withMessage("가격은 0 이상의 정수여야 합니다."),
    body("images").isArray().withMessage("이미지는 배열 형태여야 합니다."),
    body("images.*").isURL().withMessage("유효한 이미지 URL이어야 합니다."),
    body("tags").isArray().withMessage("태그는 배열 형태여야 합니다."),
    body("tags.*")
      .isString()
      .isLength({ min: 1, max: 20 })
      .withMessage("각 태그는 1-20자 사이여야 합니다."),
  ],
  update: [
    commonRules.id,
    body("name")
      .optional()
      .isString()
      .isLength({ min: 1, max: 30 })
      .withMessage("상품명은 1-30자 사이여야 합니다."),
    body("description")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("상품 설명은 비어있을 수 없습니다."),
    body("price")
      .optional()
      .isInt({ min: 0 })
      .withMessage("가격은 0 이상의 정수여야 합니다."),
    body("images")
      .optional()
      .isArray()
      .withMessage("이미지는 배열 형태여야 합니다."),
    body("images.*")
      .optional()
      .isURL()
      .withMessage("유효한 이미지 URL이어야 합니다."),
    body("tags")
      .optional()
      .isArray()
      .withMessage("태그는 배열 형태여야 합니다."),
    body("tags.*")
      .optional()
      .isString()
      .isLength({ min: 1, max: 20 })
      .withMessage("각 태그는 1-20자 사이여야 합니다."),
  ],
  list: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("페이지 번호는 1 이상의 정수여야 합니다."),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("한 페이지당 항목 수는 1-100 사이의 정수여야 합니다."),
    query("order")
      .optional()
      .isIn(["favorite", "recent"])
      .withMessage("정렬 기준은 favorite 또는 recent여야 합니다."),
  ],
};

// 사용자 관련 유효성 검사 규칙
export const userRules = {
  signUp: [
    commonRules.email,
    commonRules.nickname,
    commonRules.password,
    body("passwordConfirmation").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }
      return true;
    }),
  ],
  signIn: [commonRules.email, commonRules.password],
  updateProfile: [commonRules.url("image")],
  updatePassword: [
    body("currentPassword")
      .notEmpty()
      .withMessage("현재 비밀번호는 필수입니다."),
    commonRules.password,
    body("passwordConfirmation").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("새 비밀번호가 일치하지 않습니다.");
      }
      return true;
    }),
  ],
};

// 댓글 관련 유효성 검사 규칙
export const commentRules = {
  create: [
    body("content")
      .isString()
      .notEmpty()
      .withMessage("댓글 내용은 필수입니다."),
  ],
  update: [
    commonRules.id,
    body("content")
      .isString()
      .notEmpty()
      .withMessage("댓글 내용은 필수입니다."),
  ],
};

// 게시글 관련 유효성 검사 규칙
export const articleRules = {
  create: [
    body("title")
      .isString()
      .isLength({ min: 1, max: 50 })
      .withMessage("제목은 1-50자 사이여야 합니다."),
    body("content").isString().notEmpty().withMessage("내용은 필수입니다."),
    commonRules.url("image"),
  ],
  update: [
    commonRules.id,
    body("title")
      .optional()
      .isString()
      .isLength({ min: 1, max: 50 })
      .withMessage("제목은 1-50자 사이여야 합니다."),
    body("content")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("내용은 비어있을 수 없습니다."),
    body("image")
      .optional()
      .isURL()
      .withMessage("유효한 이미지 URL이어야 합니다."),
  ],
  list: [
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("페이지 번호는 1 이상의 정수여야 합니다."),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("한 페이지당 항목 수는 1-100 사이의 정수여야 합니다."),
    query("order")
      .optional()
      .isIn(["recent", "like"])
      .withMessage("정렬 기준은 recent 또는 like여야 합니다."),
  ],
};

// 유효성 검사 미들웨어
export const validate = (rules) => {
  return async (req, res, next) => {
    await Promise.all(rules.map((rule) => rule.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

export default validate;
