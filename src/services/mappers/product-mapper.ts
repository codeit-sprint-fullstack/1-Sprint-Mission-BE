import { Comment, Product } from "@prisma/client";
import { ImagePath } from "../product-service";

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
  const lastComment: Comment | undefined = comment[pageSize];
  const NextCusor = lastComment ? lastComment.id : "null";
  if (NextCusor !== "null") {
    comment.pop();
  }

  const commentResponse = {
    cursorInfo: {
      total,
      NextCusor,
    },
    comment,
  };

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
