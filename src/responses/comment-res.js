export const commentSelect = {
  id: true,
  content: true,
  createdAt: true,
  User: {
    select: {
      id: true,
      nickname: true,
      image: true,
    },
  },
};
