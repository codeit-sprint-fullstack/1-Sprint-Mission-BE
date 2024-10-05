import { PrismaClient } from "@prisma/client"; // Prisma ORM 사용 예시 (필요시 다른 ORM 또는 DB 라이브러리 사용 가능)

const prisma = new PrismaClient();
export async function getProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const skip = (page - 1) * pageSize;
    const orderByField = req.query.orderByField || "createdAt";
    const orderDir = req.query.orderDir || "desc";

    const products = await prisma.product.findMany({
      skip,
      take: pageSize,
      orderBy: { [orderByField]: orderDir },
    });
    return res.status(200).json({ message: "상품 정보 추출", products });
  } catch (error) {
    console.error("상품 정보 추출 중 오류 발생:", error);
    return res.status(500).json({ message: "상품 정보를 추출할 수 없습니다." });
  }
}

export async function postProduct(req, res, next) {
  try {
    const { name, description, price, tags, images } = req.body;
    const { userId } = req.user;

    const tagText = tags.map((tag) => tag.text);
    const parsedPrice = parseInt(price, 10);
    const imagesUrls = images.map((image) => image.url);
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parsedPrice,
        tags: tagText,
        images: imagesUrls,
        userId,
      },
    });
    return res.status(201).json({ message: "상품 정보 추가", product });
  } catch (error) {
    console.error("상품 정보 추가 중 오류 발생:", error);
    return res.status(500).json({ message: "상품 정보를 추가할 수 없습니다." });
  }
}

export async function getProductId(req, res, next) {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId, 10) },
    });
    return res.status(200).json({ message: "상품 정보 추출", product });
  } catch (error) {
    console.error("상품 정보 추출 중 오류 발생:", error);
    return res.status(500).json({ message: "상품 정보를 추출할 수 없습니다." });
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { productId } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId, 10) },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "해당 상품이 존재하지 않습니다." });
    }
    console.log(product.userId, req.user.userId);
    if (product.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "해당 상품을 삭제할 권한이 없습니다." });
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: parseInt(productId, 10) },
    });

    return res
      .status(200)
      .json({ message: "상품 정보 삭제 성공", deletedProduct });
  } catch (error) {
    console.error("상품 정보 삭제 중 오류 발생:", error);
    return res.status(500).json({ message: "상품 정보를 삭제할 수 없습니다." });
  }
}

export async function patchProduct(req, res, next) {
  try {
    const { productId } = req.params;
    const { name, description, price, tags, images } = req.body;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId, 10) },
      select: {
        id: true,
        userId: true,
      },
    });
    if (!product) {
      return res
        .status(404)
        .json({ message: "해당 상품이 존재하지 않습니다." });
    }

    if (product.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "해당 상품을 수정할 권한이 없습니다." });
    }

    const tagText = tags ? tags.map((tag) => tag.text) : [];
    const parsedPrice = price ? parseInt(price, 10) : undefined;
    const imagesUrls = images ? images.map((image) => image.url) : [];

    // 5. 상품 정보 업데이트
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId, 10) },
      data: {
        name: name || undefined, // name이 없으면 업데이트하지 않음
        description: description || undefined, // description이 없으면 업데이트하지 않음
        price: parsedPrice || undefined, // price가 없으면 업데이트하지 않음
        tags: tagText.length ? tagText : undefined, // tags가 없으면 업데이트하지 않음
        images: imagesUrls.length ? imagesUrls : undefined, // images가 없으면 업데이트하지 않음
      },
    });

    return res
      .status(200)
      .json({ message: "상품 정보 변경 성공", updatedProduct });
  } catch (error) {
    console.error("상품 정보 변경 중 오류 발생:", error);
    return res.status(500).json({ message: "상품 정보를 변경할 수 없습니다." });
  }
}

export async function postFavorites(req, res) {
  try {
    const { productId } = req.params; // URL 파라미터에서 productId를 가져옴
    const userId = req.user.userId; // 인증된 사용자의 id (authenticateToken 미들웨어로부터 제공됨)

    if (!productId) {
      return res.status(400).json({ message: "Product ID가 필요합니다." });
    }

    // 현재 사용자가 이미 해당 product에 좋아요를 눌렀는지 확인
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId),
        },
      },
    });

    if (existingFavorite) {
      // 이미 좋아요가 눌러진 상태라면, 좋아요를 취소 (삭제)
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });

      // 해당 Product의 favoriteCount 감소
      await prisma.product.update({
        where: { id: parseInt(productId) },
        data: {
          favoriteCount: { decrement: 1 },
        },
      });

      return res.status(200).json({ message: "좋아요가 취소되었습니다." });
    } else {
      // 좋아요가 없는 상태라면, 새로운 좋아요를 추가
      await prisma.favorite.create({
        data: {
          userId: userId,
          productId: parseInt(productId),
        },
      });

      // 해당 Product의 favoriteCount 증가
      await prisma.product.update({
        where: { id: parseInt(productId) },
        data: {
          favoriteCount: { increment: 1 },
        },
      });

      return res.status(200).json({ message: "좋아요가 추가되었습니다." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
}

export default {
  getProducts,
  postProduct,
  getProductId,
  deleteProduct,
  patchProduct,
  postFavorites,
};
