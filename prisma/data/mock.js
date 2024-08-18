export const USERS = [
  {
    id: 'b8f11e76-0a9e-4b3f-bccf-8d9b4fbf331e',
    email: 'honggd@example.com',
    name: '길동',
    createdAt: '2023-07-16T09:00:00Z',
    updatedAt: '2023-07-16T09:00:00Z',
  },
  {
    id: '6c3a18b0-11c5-4d97-9019-9ebe3c4d1317',
    email: 'kimyh@example.com',
    name: '영희',
    createdAt: '2023-07-16T09:30:00Z',
    updatedAt: '2023-07-16T09:30:00Z',
  },
  {
    id: 'fd3ae0a5-8dd5-40b6-b8fd-48870f731db1',
    email: 'lee.cs@example.com',
    name: '철수',
    createdAt: '2023-07-16T10:00:00Z',
    updatedAt: '2023-07-16T10:00:00Z',
  },
  {
    id: '70e1e61d-f2ae-4d7d-bf8f-d65eafdb6a45',
    email: 'parkjy@example.com',
    name: '지영',
    createdAt: '2023-07-16T10:30:00Z',
    updatedAt: '2023-07-16T10:30:00Z',
  },
  {
    id: '73cb9639-d8b7-4f11-9a62-53f4187f3f11',
    email: 'jungminsoo@example.com',
    name: '민수',
    createdAt: '2023-07-16T11:00:00Z',
    updatedAt: '2023-07-16T11:00:00Z',
  },
];

export const ARTICLES = [
  {
    id: '9971b725-a068-4ebd-b4b8-0951055a7845',
    title: '판다인형 요즘 파나요?',
    content: '판다인형을 구매하고 싶은데 어디서 사야 할까요??',
    createdAt: '2024-08-13T06:12:37.532Z',
    updatedAt: '2024-08-13T06:11:26.371Z',
  },
  {
    id: 'c9e0457c-2055-4f34-a2b0-b220d1161664',
    title: '맥북 가격 문의',
    content: '맥북 요즘 얼마에 팔리나요?',
    createdAt: '2024-08-13T06:12:37.532Z',
    updatedAt: '2024-08-13T06:12:19.354Z',
  },
  {
    id: '2fc7c878-782f-4bce-9977-38ce78c48157',
    title: '유튜버가 홍보한 가구 어디 거?',
    content:
      '나무 가구 봤는데 너무 갖고 싶더라구요 혹시 어디 건지 아시는 분 있으세요?',
    createdAt: '2024-08-13T06:19:04.028Z',
    updatedAt: '2024-08-13T06:19:04.028Z',
  },
  {
    id: 'c4769ce1-12c1-4e8a-8069-1aea17b531de',
    title: '아이패드 삽니다',
    content: '저렴하게 파실 분 안 계세요? ㅠㅠ',
    createdAt: '2024-08-13T06:19:42.063Z',
    updatedAt: '2024-08-13T06:19:42.063Z',
  },
];

export const COMMENTS = [
  {
    id: 'ced44d30-1835-486a-be0a-4467119a45a9',
    content: '미니도 구매하세요?',
    createdAt: '2024-08-15T06:55:12.107Z',
    articleId: 'e6c58663-b8db-44e7-baa4-d51624806def',
    userId: '9d141089-1314-435b-80dc-bd6f55c00d79',
    article: {
      category: 'MarketplaceComment',
    },
  },
  {
    id: '763877c6-1986-4312-8d21-c4afcc0207c5',
    content: '저 있어요! 연락 드릴게요!',
    createdAt: '2024-08-15T06:19:33.896Z',
    articleId: '76611d32-1530-4956-bd74-6a4ee77f6aeb',
    userId: '9d141089-1314-435b-80dc-bd6f55c00d79',
    article: {
      category: 'MarketplaceComment',
    },
  },
];
