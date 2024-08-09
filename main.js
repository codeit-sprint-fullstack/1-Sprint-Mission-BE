import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { body, validationResult } from "express-validator";
import Product from "./model/product.js";
import { DATABASE_URL, PORT } from "./env.js";

// Express 앱 설정
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Failed to connect to DB", err));

// 비동기 핸들러 유틸리티
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 상품 목록 조회
app.get(
  "/products",
  asyncHandler(async (req, res) => {
    const {
      order = "descending",
      pageSize = 10,
      page = 1,
      keyword = "",
      minPrice = 0,
      maxPrice = Infinity,
      date = "",
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const searchRegex = new RegExp(keyword, "i");
    const dateFilter = date ? { createdAt: { $gt: new Date(date) } } : {};
    const sortOrder = order === "ascending" ? 1 : -1;

    const [products, totalCount] = await Promise.all([
      Product.find({
        $or: [{ name: searchRegex }, { description: searchRegex }],
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
        ...dateFilter,
      })
        .sort({ createdAt: sortOrder })
        .skip(offset)
        .limit(parseInt(pageSize)),
      Product.countDocuments({
        $or: [{ name: searchRegex }, { description: searchRegex }],
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
        ...dateFilter,
      }),
    ]);

    res.json({
      list: products,
      totalCount,
    });
  })
);

// 상품 상세 조회
app.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
  })
);

// 상품 등록
app.post(
  "/products",
  [
    body("name").notEmpty().withMessage("상품명은 필수필드 입니다."),
    body("price").isNumeric().withMessage("가격은 숫자여야 합니다."),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("상품 설명은 필수입니다."),
    body("tags").optional().isArray().withMessage("태그는 배열이어야 합니다."),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  })
);

// 상품 수정
app.patch(
  "/products/:id",
  [
    body("name").optional().notEmpty().withMessage("상품명은 필수필드 입니다."),
    body("price").optional().isNumeric().withMessage("가격은 숫자여야 합니다."),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("상품 설명은 필수입니다."),
    body("tags").optional().isArray().withMessage("태그는 배열이어야 합니다."),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
  })
);

// 상품 삭제
app.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (deletedProduct) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "상품을 찾을 수 없습니다." });
    }
  })
);

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);
  if (err.name === "ValidationError") {
    res
      .status(400)
      .json({ message: "잘못된 요청입니다. 필수 필드를 확인해주세요." });
  } else if (err.name === "CastError") {
    res.status(400).json({ message: "유효하지 않은 ID입니다." });
  } else {
    res
      .status(500)
      .json({ message: "서버 내부 오류입니다. 관리자에게 문의해주세요." });
  }
});

// 서버 실행
app.listen(PORT, () => console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`));
