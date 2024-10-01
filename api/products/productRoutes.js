import express, { Router } from "express";
import { PrismaClient } from "@prisma/client"; // PrismaClient import
import authMiddleware from "../../middlewares/authMiddleware.js"; // JWT 토큰 인증 미들웨어 import
import multer from "multer"; // 파일 업로드를 처리하기 위한 미들웨어
import errorHandler from "../../middlewares/errorHandler.js"; // 에러 핸들러 미들웨어 import
import { validateProduct } from "../../middlewares/productValidationMiddleware.js"; // 유효성 검사 미들웨어 import

const prisma = new PrismaClient(); // PrismaClient 인스턴스 생성
const router = express.Router();

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 파일을 저장할 경로
  },
  filename: (req, file, cb) => {
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_"); // 안전한 파일 이름으로 변경
    cb(null, Date.now() + "-" + sanitizedFileName); // 수정된 파일 이름 사용
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
      const sortOption = sort === "recent" ? { createdAt: "desc" } : {}; // 'desc'로 변경

      // 검색 조건 설정
      const searchQuery = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      };

      // 페이지네이션 및 검색 적용
      const products = await prisma.marketPost.findMany({
        where: searchQuery,
        orderBy: sortOption,
        skip: Number(offset),
        take: Number(limit),
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true,
        },
      });
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

      const tagsArray = tags.split(","); // 태그를 배열로 변환

      try {
        const newProduct = await prisma.marketPost.create({
          data: {
            name,
            description,
            price: Number(price), // price를 숫자로 변환하여 저장
            tags: tagsArray,
            ownerId: req.user.userId, // 등록한 사용자의 ID 추가
            ownerNickname: req.user.nickname, // JWT에서 가져온 사용자 닉네임
            images: req.files ? req.files.map((file) => file.path) : [], // 파일 업로드 된 경우, 이미지 경로 배열 추가
          },
        });

        // 응답에 이미지 경로 추가
        res.status(201).send({
          message: "상품이 성공적으로 등록되었습니다.",
          product: newProduct,
          imageUrls: req.files ? req.files.map((file) => file.path) : [], // 이미지 경로 배열 포함
        });
      } catch (error) {
        console.error("Error creating market post:", error);
        next(error); // 에러를 핸들러로 전달
      }
    }
  );

// 상품 상세 조회 API
router.get("/:id", authMiddleware, async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user ? req.user.id : null; // 로그인한 사용자의 ID

  try {
    const product = await prisma.marketPost.findUnique({
      where: { id: Number(id) },
      include: { comments: true }, // 댓글 포함
    });

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
    const product = await prisma.marketPost.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 상품 등록자 확인
    if (product.ownerId.toString() !== req.user.id) {
      return res.status(403).send({ message: "수정 권한이 없습니다." });
    }

    const updatedProduct = await prisma.marketPost.update({
      where: { id: Number(id) },
      data: req.body,
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
    const product = await prisma.marketPost.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 상품 등록자 확인
    if (product.ownerId.toString() !== req.user.id) {
      return res.status(403).send({ message: "삭제 권한이 없습니다." });
    }

    await prisma.marketPost.delete({
      where: { id: Number(id) },
    });
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
    const product = await prisma.marketPost.findUnique({
      where: { id: Number(id) },
    });

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
      await prisma.marketPost.update({
        where: { id: Number(id) },
        data: {
          isFavorite: product.isFavorite,
          favoriteCount: product.favoriteCount,
        },
      });
      return res.status(200).send({ message: "찜이 취소되었습니다." });
    } else {
      // 찜 추가
      product.isFavorite = true;
      product.favoriteCount++; // 찜 개수 증가
      await prisma.marketPost.update({
        where: { id: Number(id) },
        data: {
          isFavorite: product.isFavorite,
          favoriteCount: product.favoriteCount,
        },
      });
      return res.status(200).send({ message: "찜이 추가되었습니다." });
    }
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
});

// 에러 핸들러 미들웨어 등록
router.use(errorHandler);

export default router;
