export const User = [
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "John Smith",
    nickname: "jsmith",
    password: "$2a$10$fL8Q6iW1xj4oRk5lS9T0mUqJtVwZ7xNz3eYpXrDyCvB",
    email: "john.smith@example.com",
    image: "/path/to/image.jpg",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "7890abc1-def2-g345-h6789012345678",
    name: "Jane Doe",
    nickname: "jane.doe",
    password: "$2a$10$fL8Q6iW1xj4oRk5lS9T0mUqJtVwZ7xNz3eYpXrDyCvB",
    email: "jane.doe@example.com",
    image: "/path/to/image.jpg",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "345e6789-cdef-ghij-klmnop-12345678901",
    name: "Bob Johnson",
    nickname: "bjohnson",
    password: "$2a$10$fL8Q6iW1xj4oRk5lS9T0mUqJtVwZ7xNz3eYpXrDyCvB",
    email: "bob.johnson@example.com",
    image: "/path/to/image.jpg",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
];

export const UserPoduct = [];

export const UserFavoriteProduct = [];

export const Product = [
  {
    id: "7890abc1-def2-g345-h6789012345678",
    name: "first product",
    description: "first product description",
    price: 1000,
    userId: "123e4567-e89b-12d3-a456-426614174001",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "345e6789-cdef-ghij-klmnop-12345678901",
    name: "second product",
    description: "second product description",
    price: 20000,
    userId: "123e4567-e89b-12d3-a456-426614174001",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
];

export const ProductTags = [];

export const ProductImages = [];

export const ProductFavoriteUser = [];

export const Article = [
  {
    id: "123e4567-e89b-12d3-a456-426614174004",
    userId: "123e4567-e89b-12d3-a456-426614174001",
    title: "My First Article",
    content: "This is my first article!",
    favorite: 1,
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "7890abc1-def2-g345-h6789012345679",
    userId: "7890abc1-def2-g345-h6789012345678",
    title: "My Second Article",
    content: "This is my second article!",
    favorite: 0,
    createdAt: "2022-02-03T15:16:17.890Z",
    updatedAt: "2022-02-04T18:19:20.123Z",
  },
];

export const ArticleFavoriteUser = [
  {
    id: "7890a001-def2-g345-h6789012345682",
    userId: "7890abc1-def2-g345-h6789012345678",
    articleId: "123e4567-e89b-12d3-a456-426614174004",
    createdAt: "2024-02-03T15:16:17.890Z",
    updatedAt: "2024-02-03T15:16:17.890Z",
  },
];

export const ArticleComment = [
  {
    id: "123e4567-e89b-12d3-a456-426614174005",
    userId: "123e4567-e89b-12d3-a456-426614174001",
    articleId: "123e4567-e89b-12d3-a456-426614174004",
    content: "This is my first article comment!",
    createdAt: "2022-01-05T21:22:23.456Z",
    updatedAt: "2022-01-06T00:03:04.789Z",
  },
  {
    id: "7890abc1-def2-g345-h6789012345682",
    userId: "7890abc1-def2-g345-h6789012345678",
    articleId: "7890abc1-def2-g345-h6789012345679",
    content: "This is my second article comment!",
    createdAt: "2022-02-07T03:04:05.123Z",
    updatedAt: "2022-02-08T06:07:08.456Z",
  },
];

export const ProductComment = [
  {
    id: "123e4567-e89b-12d3-a456-426614174005",
    userId: "123e4567-e89b-12d3-a456-426614174001",
    productId: "345e6789-cdef-ghij-klmnop-12345678901",
    content: "This is my first product comment!",
    createdAt: "2022-01-05T21:22:23.456Z",
    updatedAt: "2022-01-06T00:03:04.789Z",
  },
  {
    id: "7890abc1-def2-g345-h6789012345682",
    userId: "7890abc1-def2-g345-h6789012345678",
    productId: "345e6789-cdef-ghij-klmnop-12345678901",
    content: "This is my second product comment!",
    createdAt: "2022-02-07T03:04:05.123Z",
    updatedAt: "2022-02-08T06:07:08.456Z",
  },
];
