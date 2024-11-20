import { Comment, Product } from "@prisma/client";
import { ImagePath } from "../product-service";
import { commentPagenationMapper } from "./comment-mapper";

export function createProductMapper(product: Product, imagePath: ImagePath) {
  return {
    product: {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      tags: product.tags,
      userId: product.userId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    },
    imagePath,
  };
}

export function productDetailMapper(
  product: Product,
  comment: Comment[],
  total: number,
  pageSize: number,
  isLike: boolean | undefined
) {
  const commentResponse = commentPagenationMapper(comment, total, pageSize);

  if (isLike === undefined) {
    return {
      product,
      commentResponse,
    };
  }
  return {
    isLike,
    product,
    commentResponse,
  };
}
