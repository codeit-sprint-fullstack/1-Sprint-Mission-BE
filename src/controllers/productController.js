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

    // 1. 상품 조회 - 작성자 정보 확인
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId, 10) },
      select: {
        id: true,
        userId: true, // 작성자의 userId만 가져옵니다.
      },
    });

    // 2. 상품이 존재하지 않는 경우
    if (!product) {
      return res
        .status(404)
        .json({ message: "해당 상품이 존재하지 않습니다." });
    }
    console.log(product.userId, req.user.userId);
    // 3. 상품 작성자와 현재 유저가 동일한지 확인
    if (product.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "해당 상품을 삭제할 권한이 없습니다." });
    }

    // 4. 작성자가 동일하면 상품 삭제 수행
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

    // 1. 해당 상품을 먼저 조회하여 작성자의 userId를 확인합니다.
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId, 10) },
      select: {
        id: true,
        userId: true, // 작성자의 userId만 가져옵니다.
      },
    });

    // 2. 상품이 존재하지 않는 경우
    if (!product) {
      return res
        .status(404)
        .json({ message: "해당 상품이 존재하지 않습니다." });
    }

    // 3. 현재 사용자와 상품 작성자가 동일한지 확인합니다.
    if (product.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "해당 상품을 수정할 권한이 없습니다." });
    }

    // 4. 클라이언트에서 전달된 데이터를 기반으로 수정할 값을 준비합니다.
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

export default {
  getProducts,
  postProduct,
  getProductId,
  deleteProduct,
  patchProduct,
};
