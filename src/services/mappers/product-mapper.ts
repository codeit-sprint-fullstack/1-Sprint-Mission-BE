import { Product } from "@prisma/client";
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
