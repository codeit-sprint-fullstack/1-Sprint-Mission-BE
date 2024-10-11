function createPostResponse(product, imagePath) {
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

export {createPostResponse}