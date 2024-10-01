import express, { Router } from "express";
import MarketPost from "../../models/MarketPost.js"; // Product를 MarketPost로 변경
import authMiddleware from "../../middlewares/authMiddleware.js"; // JWT 토큰 인증 미들웨어 import
import multer from "multer"; // 파일 업로드를 처리하기 위한 미들웨어
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

// 상품 목록 조회 및 등록 API
router
  .route("/")
  .get(async (req, res, next) => {
    const { sort = "recent", offset = 0, limit = 10, search = "" } = req.query;

    try {
      // 정렬 옵션 설정
      const sortOption = sort === "recent" ? { createdAt: -1 } : {}; // 1은 오름차순, -1 내림차순

      // 검색 조건 설정
      const searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };

      // 페이지네이션 및 검색 적용
      const products = await MarketPost.find(searchQuery)
        .sort(sortOption)
        .skip(Number(offset))
        .limit(Number(limit))
        .select("id name price createdAt"); // 선택한 필드만 포함된 결과를 반환
      res.status(200).send(products);
    } catch (error) {
      next(error); // 에러를 핸들러로 전달
    }
  })
  .post(
    authMiddleware,
    upload.array("images"), // 단일 이미지에서 다중 이미지로 변경
    validateProduct,
    async (req, res, next) => {
      const { name, description, price, tags } = req.body;

      try {
        const newProduct = new MarketPost({
          name,
          description,
          price: Number(price), // price를 숫자로 변환하여 저장
          tags,
          ownerId: req.user.id, // 등록한 사용자의 ID 추가
          images: req.files ? req.files.map((file) => file.path) : [], // 파일 업로드 된 경우, 이미지 경로 배열 추가
        });

        await newProduct.save();

        // 응답에 이미지 경로 추가
        res.status(201).send({
          message: "상품이 성공적으로 등록되었습니다.",
          product: newProduct,
          imageUrls: req.files ? req.files.map((file) => file.path) : [], // 이미지 경로 배열 포함
        });
      } catch (error) {
        next(error); // 에러를 핸들러로 전달
      }
    }
  );

// 상품 상세 조회 API
router.get("/:id", authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user ? req.user.id : null; // 로그인한 사용자의 ID

  try {
    const product = await MarketPost.findById(id).populate("comments"); // 댓글 포함

    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 사용자가 찜을 눌렀는지 여부 확인
    const isFavorite = userId ? product.isFavorite : false;

    // 응답 객체에 상품 정보, 댓글 리스트, 찜 여부를 포함하여 반환
    res.status(200).send({
      product,
      comments: product.comments,
      isFavorite, // '찜' 여부 포함
    });
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
});

// 상품 수정 API
router.patch("/:id", authMiddleware, async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await MarketPost.findById(id);
    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 상품 등록자 확인
    if (product.ownerId.toString() !== req.user.id) {
      return res.status(403).send({ message: "수정 권한이 없습니다." });
    }

    const updatedProduct = await MarketPost.findByIdAndUpdate(id, req.body, {
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
  const { id } = req.params;

  try {
    const product = await MarketPost.findById(id);
    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 상품 등록자 확인
    if (product.ownerId.toString() !== req.user.id) {
      return res.status(403).send({ message: "삭제 권한이 없습니다." });
    }

    await MarketPost.findByIdAndDelete(id);
    res.status(200).send({ message: "상품이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
});

// 상품에 찜 추가 및 삭제 API
router.post("/:id/favorite", authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id; // 인증된 사용자 ID

  try {
    const product = await MarketPost.findById(id);

    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 사용자가 찜을 눌렀는지 확인
    const isFavorite = product.isFavorite;

    // 찜 추가/삭제 로직
    if (isFavorite) {
      // 찜을 취소
      product.isFavorite = false;
      product.favoriteCount--; // 찜 개수 감소
      await product.save();
      return res.status(200).send({ message: "찜이 취소되었습니다." });
    } else {
      // 찜 추가
      product.isFavorite = true;
      product.favoriteCount++; // 찜 개수 증가
      await product.save();
      return res.status(200).send({ message: "찜이 추가되었습니다." });
    }
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
});

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;
