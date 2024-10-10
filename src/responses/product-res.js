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
