import { Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma, Product } from "@prisma/client";

const prisma = new PrismaClient();

type ProductWithLikesAndComments = Prisma.ProductGetPayload<{
  include: { likes: true; comments: true };
}>;

// 상품 등록
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { name, description, price, tags } = req.body;
  const images = req.body.images || [];

  try {
    const product: Product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        tags,
        image: images,
        userId: req.user?.id as number,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// 상품 목록 조회
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { page = 1, pageSize = 10, orderBy = "recent", keyword = "" } = req.query;

  let sortBy: any = {};
  if (orderBy === "recent") {
    sortBy = { createdAt: "desc" };
  } else if (orderBy === "favorite") {
    sortBy = { likes: { _count: "desc" } };
  }

  try {
    const products: ProductWithLikesAndComments[] = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: keyword as string, mode: "insensitive" } },
          { description: { contains: keyword as string, mode: "insensitive" } },
        ],
      },
      skip: (Number(page) - 1) * Number(pageSize),
      take: Number(pageSize),
      orderBy: sortBy,
      include: {
        likes: true,
        comments: true,
      },
    });

    const totalCount = await prisma.product.count({
      where: {
        OR: [
          { name: { contains: keyword as string, mode: "insensitive" } },
          { description: { contains: keyword as string, mode: "insensitive" } },
        ],
      },
    });

    res.status(200).json({ totalCount, list: products });
  } catch (error) {
    next(error);
  }
};

// 특정 상품 조회
export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { productId } = req.params;

  try {
    const product: ProductWithLikesAndComments | null = await prisma.product.findUnique({
      where: { id: Number(productId) },
      include: {
        likes: true,
        comments: true,
      },
    });
    if (!product) {
      res.status(404).json({ error: "해당 상품을 찾을 수 없습니다." });
      return;
    }

    const isFavorite = product.likes.some((like) => like.userId === req.user?.id);
    res.status(200).json({ ...product, isFavorite });
  } catch (error) {
    next(error);
  }
};

// 상품 수정
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { productId } = req.params;
  const { name, description, price, tags } = req.body;
  const images = req.body.images || [];

  try {
    const product: Product = await prisma.product.update({
      where: { id: Number(productId) },
      data: { name, description, price: Number(price), tags, image: images },
    });
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// 상품 삭제
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { productId } = req.params;

  try {
    await prisma.product.delete({
      where: { id: Number(productId) },
    });
    res.status(200).json({ id: productId });
  } catch (error) {
    next(error);
  }
};
