import { Article, Like, Product, User } from "@prisma/client";

interface CreateLikeMapperEntity {
  like: Like;
  likeTotal: number;
  user: User;
}

interface ArticleCreateLikeMapper extends CreateLikeMapperEntity {
  article: Article;
}

interface ProductCreateLikeMapper extends CreateLikeMapperEntity {
  product: Product;
}

export function articleCreateLikeMapper(aticleResponsData: ArticleCreateLikeMapper) {
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

export function productCreateLikeMapper(productResponsData: ProductCreateLikeMapper) {
  const { like, likeTotal, user, product } = productResponsData;
  const resData = {
    updatedAt: like.updatedAt,
    createdAt: like.createdAt,
    likeCount: likeTotal,
    writer: {
      nickname: user.nickname,
      id: user.id,
    },
    description: product.description,
    name: product.name,
    id: product.id,
  };

  return { ...resData, isLike: true };
}
