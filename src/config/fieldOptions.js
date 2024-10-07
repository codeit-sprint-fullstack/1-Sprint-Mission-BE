const TIME_STAMP = {
  createdAt: true,
  updatedAt: true,
};

export const USER_FIELDS = {
  id: true,
  nickname: true,
  image: true,
  refreshToken: true,
};

export const PRODUCT_FIELDS = {
  id: true,
  name: true,
  images: true,
  favoriteCount: true,
  description: true,
  price: true,
  tags: true,
  ...TIME_STAMP,
};

export const ARTICLE_FIELDS = {
  id: true,
  title: true,
  image: true,
  likeCount: true,
  content: true,
  ...TIME_STAMP,
};

export const COMMENT_FIELD = {
  id: true,
  content: true,
  ...TIME_STAMP,
};

export const OWNER_FIELDS = {
  id: true,
  nickname: true,
  image: true,
};
