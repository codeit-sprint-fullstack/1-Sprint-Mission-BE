export const postSelect = {
  id: true,
  title: true,
  content: true,
  favoriteCount: true,
  createdAt: true,
  PostImage: {
    select: {
      image: true,
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

export const PostFavoriteSelect = (myUserId) => ({
  ...postSelect,
  FavoritePost: {
    where: {
      userId: myUserId,
    },
    select: {
      id: true,
    },
  },
});

export const postDetailSelect = (myUserId) => ({
  ...PostFavoriteSelect,
  PostComment: {
    orderBy: { createdAt: "asc" },
    skip: 0,
    take: SHOW_DEFAULT_COMMENT_COUNT,
    select: {
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
    },
  },
});
