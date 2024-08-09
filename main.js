import mongoose from "mongoose";
import { DATABASE_URL, PORT } from "./env.js";
import express from "express";
import Product from "./model/productAPI.js";
import cors from "cors";
import { body, validationResult } from "express-validator";

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB 연결
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Failed to connect to DB", err));

// 비동기 핸들러
const asyncHandle = (handle) => (req, res, next) => {
  handle(req, res, next).catch(next);
};

// 상품 목록 조회
app.get(
  "/products",
  asyncHandle(async (req, res) => {
    const {
      order = "recent",
      pageSize = 10,
      page = 1,
      keyword = "",
      minPrice = 0,
      maxPrice = Infinity,
      date = "",
    } = req.query;

    const offset = (page - 1) * pageSize;
    const regex = new RegExp(keyword, "i");
    const dateQuery = date ? { createdAt: { $gt: new Date(date) } } : {};
    const orderOption = { createdAt: order === "recent" ? -1 : 1 };

    const [products, totalCount] = await Promise.all([
      Product.find({
        $or: [{ name: regex }, { description: regex }],
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
        ...dateQuery,
      })
        .sort(orderOption)
        .skip(offset)
        .limit(Number(pageSize)),
      Product.countDocuments({
        $or: [{ name: regex }, { description: regex }],
        price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
        ...dateQuery,
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
  asyncHandle(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "해당 상품은 존재하지 않습니다" });
    }
  })
);

// 상품 등록
app.post(
  "/products",
  [
    body("name").notEmpty().withMessage("상품명은 필수값입니다"),
    body("price").isNumeric().withMessage("가격은 Number 여야 합니다."),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("상품 설명은 필수값입니다"),
    body("tags")
      .optional()
      .isArray()
      .withMessage("태그는 Array 이어야 합니다."),
  ],
  asyncHandle(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  })
);

// 상품 수정
app.patch(
  "/products/:id",
  [
    body("name").optional().notEmpty().withMessage("상품명은 필수값입니다"),
    body("price")
      .optional()
      .isNumeric()
      .withMessage("가격은 Number 여야 합니다"),
    body("description")
      .optional()
      .notEmpty()
      .withMessage("상품 설명은 필수값입니다"),
    body("tags").optional().isArray().withMessage("태그는 Array 이어야 합니다"),
  ],
  asyncHandle(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "해당 상품은 존재하지 않습니다" });
    }
  })
);

// 상품 삭제
app.delete(
  "/products/:id",
  asyncHandle(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "해당 상품은 존재하지 않습니다" });
    }
  })
);

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.name === "ValidationError") {
    res.status(400).json({ message: err.message });
  } else if (err.name === "CastError") {
    res.status(400).json({ message: "유효하지 않은 ID입니다" });
  } else {
    res.status(500).json({ message: "서버 내부 오류입니다" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
