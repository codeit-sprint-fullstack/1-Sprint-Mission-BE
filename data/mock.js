export const User = [
  {
    id: "123e4567-e89b-12d3-a456-426614174001",
    name: "이진우",
    nickname: "몽유랑",
    password: "$2a$10$fL8Q6iW1xj4oRk5lS9T0mUqJtVwZ7xNz3eYpXrDyCvB",
    email: "jinwoo@example.com",
    image: "https://ifh.cc/g/cSYLVn.png",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "7890abc1-def2-g345-h6789012345678",
    name: "안두인",
    nickname: "Allience",
    password: "$2a$10$fL8Q6iW1xj4oRk5lS9T0mUqJtVwZ7xNz3eYpXrDyCvB",
    email: "and@example.com",
    image: "https://ifh.cc/g/ojY5Vr.jpg",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "345e6789-cdef-ghij-klmnop-12345678901",
    name: "스랄",
    nickname: "Horde",
    password: "$2a$10$fL8Q6iW1xj4oRk5lS9T0mUqJtVwZ7xNz3eYpXrDyCvB",
    email: "thr@example.com",
    image: "https://ifh.cc/g/25YQq2.jpg",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "345e6789-cdef-ghij-klmnop-12345678902",
    name: "실리안",
    nickname: "루테란 국왕",
    password: "$2a$10$fL8Q6iW1xj4oRk5lS9T0mUqJtVwZ7xNz3eYpXrDyCvB",
    email: "sil@example.com",
    image: "https://ifh.cc/g/1btdoy.png",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "345e6789-cdef-ghij-klmnop-12345678903",
    name: "아만",
    nickname: "로스트아크",
    password: "$2a$10$fL8Q6iW1xj4oRk5lS9T0mUqJtVwZ7xNz3eYpXrDyCvB",
    email: "arm@example.com",
    image: "https://ifh.cc/g/ANb6SK.png",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "345e6789-cdef-ghij-klmnop-12345678904",
    name: "니나브",
    nickname: "에스더",
    password: "$2a$10$fL8Q6iW1xj4oRk5lS9T0mUqJtVwZ7xNz3eYpXrDyCvB",
    email: "nin@example.com",
    image: "https://ifh.cc/g/DfVJYO.png",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
];

export const Product = [
  {
    id: "7890abc1-def2-g345-h6789012345678",
    name: "PS5 팝니다",
    description: "현생이 바빠서 기기 처분합니다",
    price: 350000,
    userId: "123e4567-e89b-12d3-a456-426614174001",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "345e6789-cdef-ghij-klmnop-12345678901",
    name: "PS 타이틀 팝니다",
    description: "현생이 너무 바빠 정리합니다",
    price: 240000,
    userId: "123e4567-e89b-12d3-a456-426614174001",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "345e6789-cdef-ghij-klmnop-12345678902",
    name: "스틈윈드 특산 포도주 팝니다",
    description: "내부 전쟁 준비로 비품 확인 중 찾은 귀한 포도주 팝니다",
    price: 2000000,
    userId: "7890abc1-def2-g345-h6789012345678",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "345e6789-cdef-ghij-klmnop-12345678903",
    name: "오그리마 특산 텐트 팝니다",
    description: "어디서든 편하게 설치 가능한 텐트 팝니다. 오그리마 산이예요~",
    price: 500000,
    userId: "345e6789-cdef-ghij-klmnop-12345678901",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
];

export const ProductTags = [];

export const ProductImages = [];

export const FavoriteProduct = [];

export const Post = [
  {
    id: "123e4567-e89b-12d3-a456-426614174004",
    userId: "123e4567-e89b-12d3-a456-426614174001",
    title: "여기가 자유 게시판인가요?",
    content: "첫 글 성공",
    favoriteCount: 3,
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-02T12:34:56.789Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174005",
    userId: "7890abc1-def2-g345-h6789012345678",
    title: "요즘 와우 재미있나요?",
    content: "평가도 좋던데",
    favoriteCount: 1,
    createdAt: "2022-02-03T15:16:17.890Z",
    updatedAt: "2022-02-04T18:19:20.123Z",
  },
  {
    id: "123e4567-e89b-12d3-a456-426614174006",
    userId: "345e6789-cdef-ghij-klmnop-12345678903",
    title: "요즘 로아 재미있나요?",
    content: "초각성 나왔습니다",
    favoriteCount: 1,
    createdAt: "2024-07-03T15:16:17.890Z",
    updatedAt: "2024-07-04T18:19:20.123Z",
  },
];

export const FavoritePost = [
  {
    id: "7890a001-def2-g345-h6789012345682",
    userId: "7890abc1-def2-g345-h6789012345678",
    postId: "123e4567-e89b-12d3-a456-426614174004",
    createdAt: "2024-02-03T15:16:17.890Z",
    updatedAt: "2024-02-03T15:16:17.890Z",
  },
  {
    id: "7890a001-def2-g345-h6789012345683",
    userId: "345e6789-cdef-ghij-klmnop-12345678903",
    postId: "123e4567-e89b-12d3-a456-426614174004",
    createdAt: "2024-02-03T15:16:17.890Z",
    updatedAt: "2024-02-03T15:16:17.890Z",
  },
  {
    id: "7890a001-def2-g345-h6789012345684",
    userId: "345e6789-cdef-ghij-klmnop-12345678904",
    postId: "123e4567-e89b-12d3-a456-426614174004",
    createdAt: "2024-02-03T15:16:17.890Z",
    updatedAt: "2024-02-03T15:16:17.890Z",
  },
  {
    id: "7890a001-def2-g345-h6789012345685",
    userId: "123e4567-e89b-12d3-a456-426614174001",
    postId: "123e4567-e89b-12d3-a456-426614174005",
    createdAt: "2024-02-03T15:16:17.890Z",
    updatedAt: "2024-02-03T15:16:17.890Z",
  },
  {
    id: "7890a001-def2-g345-h6789012345686",
    userId: "123e4567-e89b-12d3-a456-426614174001",
    postId: "123e4567-e89b-12d3-a456-426614174006",
    createdAt: "2024-02-03T15:16:17.890Z",
    updatedAt: "2024-02-03T15:16:17.890Z",
  },
];

export const PostComment = [
  {
    id: "123e4567-e89b-12d3-a456-426614174005",
    userId: "123e4567-e89b-12d3-a456-426614174001",
    postId: "123e4567-e89b-12d3-a456-426614174004",
    content: "성공",
    createdAt: "2022-01-05T21:22:23.456Z",
    updatedAt: "2022-01-06T00:03:04.789Z",
  },
  {
    id: "7890abc1-def2-g345-h6789012345682",
    userId: "123e4567-e89b-12d3-a456-426614174001",
    postId: "123e4567-e89b-12d3-a456-426614174005",
    content: "지인들이 다시 시작해서 관심은 가는데 현생이...",
    createdAt: "2022-02-07T03:04:05.123Z",
    updatedAt: "2022-02-08T06:07:08.456Z",
  },
  {
    id: "7890abc1-def2-g345-h6789012345683",
    userId: "123e4567-e89b-12d3-a456-426614174001",
    postId: "123e4567-e89b-12d3-a456-426614174006",
    content: "출석 보상도 겨우 받고 있습니다 ㅠㅠ",
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
