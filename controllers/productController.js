import { PrismaClient } from "@prisma/client"; // PrismaClient import

const prisma = new PrismaClient(); // PrismaClient 인스턴스 생성

// 상품 목록 조회 및 등록 API
export const getProducts = async (req, res, next) => {
  const { sort = "recent", offset = 0, limit = 10, search = "" } = req.query;

  try {
    // 정렬 옵션 설정
    const sortOption = {};
    if (sort === "recent") {
      sortOption.createdAt = "desc"; // 최신순
    } else if (sort === "favorite") {
      sortOption.favoriteCount = "desc"; // 좋아요순
    }

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
        favoriteCount: true, // 좋아요 개수 포함
        images: true, // images 필드 추가
      },
    });
    res.status(200).send(products);
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
};

export const createProduct = async (req, res, next) => {
  const { name, description, price, tags } = req.body;

  const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];
  // 태그가 없으면 빈 배열

  try {
    const newProduct = await prisma.marketPost.create({
      data: {
        name,
        description,
        price: Number(price), // price를 숫자로 변환하여 저장
        tags: tagsArray,
        ownerId: req.user.id, // 수정된 부분
        ownerNickname: req.user.nickname, // 수정된 부분
        images: req.files
          ? req.files.map(
              (file) => `http://localhost:8000/uploads/${file.filename}`
            )
          : [], // 파일 업로드 된 경우, 이미지 경로 배열 추가
      },
    });

    // 응답에 이미지 경로 추가
    res.status(201).send({
      message: "상품이 성공적으로 등록되었습니다.",
      product: newProduct,
      imageUrls: req.files
        ? req.files.map(
            (file) => `http://localhost:8000/uploads/${file.filename}`
          )
        : [], // 클라이언트가 사용할 이미지 경로
    });
  } catch (error) {
    console.error("Error creating market post:", error);
    next(error); // 에러를 핸들러로 전달
  }
};

// 상품 상세 조회 API
export const getProductById = async (req, res, next) => {
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
};

// 상품 수정 API
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;

  console.log("Request Body:", req.body); // 요청 본문 출력 추가
  console.log("Uploaded Files:", req.files); // 업로드된 파일 출력 추가

  try {
    const product = await prisma.marketPost.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 상품 등록자 확인
    if (product.ownerId.toString() !== req.user.id.toString()) {
      return res.status(403).send({ message: "수정 권한이 없습니다." });
    }

    // 각 필드 빈 문자열인지 확인하고, 기본 값 유지
    const updatedData = {
      name: req.body.name || product.name,
      description: req.body.description || product.description,
      price: req.body.price ? Number(req.body.price) : product.price, // price를 숫자로 변환
      images: req.files
        ? req.files.map(
            (file) => `http://localhost:8000/uploads/${file.filename}`
          ) // 업로드된 이미지 경로 배열
        : product.images,
      tags: Array.isArray(req.body.tags) ? req.body.tags : product.tags, // tags도 배열로 처리
    };

    const updatedProduct = await prisma.marketPost.update({
      where: { id: Number(id) },
      data: updatedData,
    });
    console.log("Updated Product:", updatedProduct); // 수정된 상품 출력

    res.status(200).send(updatedProduct);
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
};

// 상품 삭제 API
export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  console.log("Request User ID:", req.user.id);

  try {
    const product = await prisma.marketPost.findUnique({
      where: { id: Number(id) },
    });
    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 상품 등록자 확인
    if (product.ownerId.toString() !== req.user.id.toString()) {
      return res.status(403).send({ message: "삭제 권한이 없습니다." });
    }

    await prisma.marketPost.delete({
      where: { id: Number(id) },
    });
    res.status(200).send({ message: "상품이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
};

// 상품에 좋아요(찜) 추가 및 삭제 API
export const toggleFavorite = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id; // 인증된 사용자 ID

  try {
    const product = await prisma.marketPost.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).send({ message: "상품을 찾을 수 없습니다." });
    }

    // 사용자가 좋아요 눌렀는지 확인 (undefined 체크 추가)
    const isFavorite = product.isFavorite || false;

    // 좋아요 추가/삭제 로직
    if (isFavorite) {
      // 좋아요 취소
      product.isFavorite = false;
      product.favoriteCount--; // 좋아요 개수 감소
      await prisma.marketPost.update({
        where: { id: Number(id) },
        data: {
          isFavorite: product.isFavorite,
          favoriteCount: product.favoriteCount,
        },
      });
      return res.status(200).send({ message: "좋아요가 취소되었습니다." });
    } else {
      // 좋아요 추가
      product.isFavorite = true;
      product.favoriteCount++; // 좋아요 개수 증가
      await prisma.marketPost.update({
        where: { id: Number(id) },
        data: {
          isFavorite: product.isFavorite,
          favoriteCount: product.favoriteCount,
        },
      });
      return res.status(200).send({ message: "좋아요가 추가되었습니다." });
    }
  } catch (error) {
    next(error); // 에러를 핸들러로 전달
  }
};
