export const userSelect = {
  id: true,
  email: true,
  name: true,
  nickname: true,
  image: true,
  createdAt: true,
};

export const productSelect = {
  id: true,
  name: true,
  description: true,
  price: true,
  favoriteCount: true,
  createdAt: true,
  ProductImage: {
    select: {
      image: true,
    },
  },
  ProductTag: {
    select: {
      tag: true,
    },
  },
  user: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
};

export const productForm = (data) => ({
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
});
