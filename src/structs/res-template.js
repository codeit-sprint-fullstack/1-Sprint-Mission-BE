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
};

export const productInclude = {
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
  User: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
};
