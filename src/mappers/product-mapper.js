export function productForm(data) {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    favoriteCount: data.favoriteCount,
    images: data.ProductImage.map((imgObj) => imgObj.image),
    tags: data.ProductTag.map((tagObj) => tagObj.tag),
    ownerId: data.user.id,
    ownerImage: data.user.image,
    ownerNickname: data.user.nickname,
    crearedAt: data.createdAt,
  };
}
