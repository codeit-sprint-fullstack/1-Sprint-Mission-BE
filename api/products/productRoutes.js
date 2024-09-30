import express, { Router } from "express";
import Product from "../../models/Product.js";
import authMiddleware from "../../middlewares/authMiddleware.js"; // JWT 토큰 인증 미들웨어 import
import multer from "multer"; //  파일 업로드를 처리하기 위한 미들웨어
import errorHandler from "../../middlewares/errorHandler.js"; // 에러 핸들러 미들웨어 import
import { validateProduct } from "../../middlewares/productValidationMiddleware.js"; // 유효성 검사 미들웨어 import

const router = express.Router();

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 파일을 저장할 경로
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // 파일 이름 설정
  },
});

const upload = multer({ storage });

// 상품 목록 조회
router.get("/", async (req, res, next) => {
  // next 추가
  const { sort = "recent", offset = 0, limit = 10, search = "" } = req.query;

  try {
    // 정렬 옵션 설정
    const sortOption = sort === "recent" ? { createdAt: -1 } : {}; // 1은 오름차순, -1 내림차순

    // 검색 조건 설정
    const searchQuery = {
      $or: [
        // 두 가지 조건 중 하나라도 만족하는 문서를 찾도록 설정
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
      // regex : name 또는 description 필드에서 search 문자열을 찾음
      // 'i': 대소문자 구분 없이 검색하도록 설정
    };

    // 페이지네이션 및 검색 적용
    const products = await Product.find(searchQuery) // 조건에 맞는 문서 조회
      .sort(sortOption) // 정렬함
      .skip(Number(offset)) // offset만큼 문서 건너뜀
      .limit(Number(limit)) // 최대 limit 만큼 문서 반환
      .select("id name price createdAt"); // 선택한 필드만 포함된 결과를 반환
    res.status(200).send(products);
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
});

// 상품 상세 조회 API
router.get("/:id", authMiddleware, async (req, res, next) => {
  // next 추가
  const { id } = req.params;
  const userId = req.user ? req.user.id : null; // 로그인한 사용자의 ID

  try {
    const product = await Product.findById(id) // Product 모델 사용
      .populate("comments") // 댓글 포함
      .populate("likes"); // 좋아요 포함

    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 사용자가 좋아요를 눌렀는지 여부 확인
    const isLiked = userId
      ? product.likes.some((like) => like.userId.toString() === userId) // userId를 문자열로 비교
      : false;

    // 응답 객체에 상품 정보, 댓글 리스트, 좋아요 여부를 포함하여 반환
    res.status(200).send({
      product,
      comments: product.comments,
      isLiked, // '좋아요' 여부 포함
    });
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
});

// 상품 등록 API
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validateProduct,
  async (req, res, next) => {
    // next 추가
    // 인증 미들웨어 및 multer 미들웨어 및 유효성검사 미들웨어 추가
    const { name, description, price, tags } = req.body;

    try {
      const newProduct = new Product({
        name,
        description,
        price: Number(price), // price를 숫자로 변환하여 저장
        tags,
        userId: req.user.id, // 등록한 사용자의 ID 추가
        image: req.file ? req.file.path : null, // 파일 업로드 된 경우, 이미지 경로 추가
      });

      await newProduct.save();

      // 응답에 이미지 경로 추가
      res.status(201).send({
        message: "상품이 성공적으로 등록되었습니다.",
        product: newProduct,
        imageUrl: req.file ? req.file.path : null, // 이미지 경로 포함
      });
    } catch (error) {
      next(error); // 에러를 핸들러로 전달
    }
  }
);

// 상품 수정 API
router.patch("/:id", authMiddleware, async (req, res, next) => {
  // next 추가
  // 인증 미들웨어 추가
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 상품 등록자 확인
    if (product.userId.toString() !== req.user.id) {
      return res.status(403).send({ message: "수정 권한이 없습니다." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // 유효성 검사
    });

    res.status(200).send(updatedProduct);
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
});

// 상품 삭제 API
router.delete("/:id", authMiddleware, async (req, res, next) => {
  // next 추가
  // 인증 미들웨어 추가
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 상품 등록자 확인
    if (product.userId.toString() !== req.user.id) {
      return res.status(403).send({ message: "삭제 권한이 없습니다." });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).send({ message: "상품이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
});

// 상품에 좋아요 추가 및 삭제 API
router.post("/:id/favorite", authMiddleware, async (req, res, next) => {
  // next 추가
  const { id } = req.params;
  const userId = req.user.id; // 인증된 사용자 ID

  try {
    const product = await Product.findById(id).populate("likes"); // Product 모델 사용

    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 사용자가 좋아요를 눌렀는지 확인
    const isLiked = product.likes.some(
      (like) => like.userId.toString() === userId
    ); // userId를 문자열로 비교

    // 좋아요 추가/삭제 로직
    if (isLiked) {
      // 좋아요를 취소
      product.likes.pull(userId);
      await product.save();
      return res.status(200).send({ message: "좋아요가 취소되었습니다." });
    } else {
      // 좋아요 추가
      product.likes.push(userId);
      await product.save();
      return res.status(200).send({ message: "좋아요가 추가되었습니다." });
    }
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
});

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;
