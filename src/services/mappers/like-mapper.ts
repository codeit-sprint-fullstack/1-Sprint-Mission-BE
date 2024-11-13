import { Article, Like, User } from "@prisma/client";

interface ArticleResponseData {
  like: Like;
  likeTotal: number;
  user: User;
  article: Article;
}

export function articleLikeMapper(aticleResponsData: ArticleResponseData) {
  const { like, likeTotal, user, article } = aticleResponsData;
  const resData = {
    updatedAt: like.updatedAt,
    createdAt: like.createdAt,
    likeCount: likeTotal,
    writer: {
      nickname: user.nickname,
      id: user.id,
    },
    content: article.content,
    title: article.title,
    id: article.id,
  };

  return { ...resData, isLike: true };
}
