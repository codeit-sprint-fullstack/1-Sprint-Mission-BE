import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

// 사용자 요청 객체에 사용자 정보가 포함될 때 타입 정의
export interface CustomRequest extends Request {
  user: {
    userId: number;
  };
}

// 상품 목록 가져오기
export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
    const skip = (page - 1) * pageSize;
    const orderByField = (req.query.orderByField as string) || 'createdAt';
    const orderDir = (req.query.orderDir as string) || 'desc';

    const products = await prisma.product.findMany({
      skip,
      take: pageSize,
      orderBy: { [orderByField]: orderDir },
    });
    return res.status(200).json({ message: '상품 정보 추출', products });
  } catch (error) {
    console.error('상품 정보 추출 중 오류 발생:', error);
    return res.status(500).json({ message: '상품 정보를 추출할 수 없습니다.' });
  }
}

// 상품 추가
export async function postProduct(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { name, description, price, tags, images } = req.body;
    const { userId } = req.user;

    // `tags` 배열에서 `undefined`, `null`, 빈 문자열을 필터링
    const tagText: string[] = Array.isArray(tags)
      ? tags.filter((tag) => typeof tag === 'string' && tag.trim() !== '')
      : [];

    // 가격 파싱 및 검증
    const parsedPrice = parseInt(price, 10);
    if (isNaN(parsedPrice)) {
      return res
        .status(400)
        .json({ message: '가격은 유효한 숫자여야 합니다.' });
    }

    // `images` 배열에서 `undefined`, `null`, 빈 문자열을 필터링
    const imagesUrls: string[] = Array.isArray(images)
      ? images.filter(
          (image) => typeof image === 'string' && image.trim() !== ''
        )
      : [];

    // Prisma로 데이터베이스에 제품 정보 추가
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

    return res.status(201).json({ message: '상품 정보 추가 성공', product });
  } catch (error: any) {
    console.error('상품 정보 추가 중 오류 발생:', error);
    if (error.code === 'P2002') {
      // 중복 오류 처리 (예: 중복된 유저 또는 기타 고유 필드의 중복)
      return res.status(409).json({ message: '중복된 데이터가 있습니다.' });
    }
    return res.status(500).json({ message: '상품 정보를 추가할 수 없습니다.' });
  }
}

// 상품 ID로 정보 가져오기
export async function getProductId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { productId } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(productId, 10) },
    });
    return res.status(200).json({ message: '상품 정보 추출', product });
  } catch (error) {
    console.error('상품 정보 추출 중 오류 발생:', error);
    return res.status(500).json({ message: '상품 정보를 추출할 수 없습니다.' });
  }
}

// 상품 삭제
export async function deleteProduct(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
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
        .json({ message: '해당 상품이 존재하지 않습니다.' });
    }

    if (product.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: '해당 상품을 삭제할 권한이 없습니다.' });
    }

    const deletedProduct = await prisma.product.delete({
      where: { id: parseInt(productId, 10) },
    });

    return res
      .status(200)
      .json({ message: '상품 정보 삭제 성공', deletedProduct });
  } catch (error) {
    console.error('상품 정보 삭제 중 오류 발생:', error);
    return res.status(500).json({ message: '상품 정보를 삭제할 수 없습니다.' });
  }
}

// 상품 수정
export async function patchProduct(
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
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
        .json({ message: '해당 상품이 존재하지 않습니다.' });
    }

    if (product.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: '해당 상품을 수정할 권한이 없습니다.' });
    }

    // 태그 및 이미지 필터링
    const tagText: string[] = tags
      ? tags
          .filter((tag: { text: string }) => tag && tag.text !== undefined)
          .map((tag: { text: string }) => tag.text)
      : [];

    const imagesUrls: string[] = images
      ? images
          .filter((image: { url: string }) => image && image.url !== undefined)
          .map((image: { url: string }) => image.url)
      : [];

    // 가격 필터링: undefined 값을 허용하지 않도록 필터링
    const parsedPrice =
      price !== undefined && price !== null ? parseInt(price, 10) : undefined;

    // 업데이트할 데이터 필터링하여 Prisma가 허용하지 않는 undefined 값이 없도록 처리
    const updateData: {
      name?: string;
      description?: string;
      price?: number;
      tags?: string[];
      images?: string[];
    } = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (parsedPrice !== undefined) updateData.price = parsedPrice;
    if (tagText.length > 0) updateData.tags = tagText;
    if (imagesUrls.length > 0) updateData.images = imagesUrls;

    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(productId, 10) },
      data: updateData,
    });

    return res
      .status(200)
      .json({ message: '상품 정보 변경 성공', updatedProduct });
  } catch (error) {
    console.error('상품 정보 변경 중 오류 발생:', error);
    return res.status(500).json({ message: '상품 정보를 변경할 수 없습니다.' });
  }
}

// 좋아요 추가/취소
export async function postFavorites(
  req: CustomRequest,
  res: Response
): Promise<Response | void> {
  try {
    const { productId } = req.params;
    const userId = req.user.userId;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID가 필요합니다.' });
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId: userId,
          productId: parseInt(productId),
        },
      },
    });

    if (existingFavorite) {
      // 좋아요 취소
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });

      await prisma.product.update({
        where: { id: parseInt(productId) },
        data: {
          favoriteCount: { decrement: 1 },
        },
      });

      return res.status(200).json({ message: '좋아요가 취소되었습니다.' });
    } else {
      // 좋아요 추가
      await prisma.favorite.create({
        data: {
          userId: userId,
          productId: parseInt(productId),
        },
      });

      await prisma.product.update({
        where: { id: parseInt(productId) },
        data: {
          favoriteCount: { increment: 1 },
        },
      });

      return res.status(200).json({ message: '좋아요가 추가되었습니다.' });
    }
  } catch (error) {
    console.error('좋아요 처리 중 오류 발생:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
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
