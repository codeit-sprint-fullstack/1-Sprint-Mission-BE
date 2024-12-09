import { ArticleRepository } from "../repositorys/articleRepository";
import { Favorite, Prisma, User } from "@prisma/client";

interface Article {
  id: number;
  title: string;
  content: string;
  images: string[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  writer: User;
  favorites: Favorite[];
  isLiked?: boolean;
  likeCount?: number;
}

interface User_Article {
  articleId: number;
  userId: number;
}

const articleRepository = new ArticleRepository();

const generateWhereCondition = (keyword: string): Prisma.ArticleWhereInput => {
  return keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { content: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};
};

const generateOrderCondition = (
  orderBy: string
): Prisma.Enumerable<Prisma.ArticleOrderByWithRelationInput> => {
  if (orderBy === "favorite") {
    return [{ likeCount: "desc" }, { createdAt: "desc" }];
  }
  return { createdAt: "desc" };
};

export const getArticles = async (
  page: number = 1,
  pageSize: number = 10,
  keyword: string = "",
  orderBy: string = "recent"
): Promise<{
  list: Article[];
  totalCount: number;
  page: number;
  pageSize: number;
}> => {
  const offset = (page - 1) * pageSize;
  const whereCondition = generateWhereCondition(keyword);
  const orderCondition = generateOrderCondition(orderBy);

  const [list, totalCount] = await Promise.all([
    articleRepository.findMany(
      whereCondition,
      orderCondition,
      offset,
      pageSize
    ),
    articleRepository.count(whereCondition),
  ]);

  const listWithLikeStatus = list.map((article) => ({
    ...article,
    favorites: (article.favorites || []).map((fav) => ({
      id: fav.id,
      userId: fav.userId,
      articleId: fav.articleId,
    })),
  })) as Article[];

  return { list: listWithLikeStatus, totalCount, page, pageSize };
};

export const createArticle = async (
  images: string[],
  content: string,
  title: string,
  userId: number
): Promise<Article> => {
  const newArticle = await articleRepository.create(
    { images, content, title, userId },
    userId
  );

  return {
    ...newArticle,
    favorites: newArticle.favorites.map((fav) => ({
      id: fav.id,
      userId,
      articleId: newArticle.id,
    })),
  } as Article;
};

export const getArticleById = async ({
  articleId,
  userId,
}: User_Article): Promise<Article> => {
  const article = await articleRepository.findUnique(articleId, userId);
  if (!article) throw new Error("Article not found");

  const isLiked = article.favorites.length > 0;

  return {
    ...article,
    favorites: article.favorites.map((fav) => ({
      id: fav.id,
      userId: fav.userId,
      articleId: fav.articleId,
    })),
    isLiked,
  } as Article;
};

export const updateArticle = async (
  articleId: number,
  userId: number,
  images: string[],
  title: string,
  content: string
): Promise<Article> => {
  const updatedArticle = await articleRepository.update(
    articleId,
    { images, title, content },
    userId
  );

  return {
    ...updatedArticle,
    favorites: updatedArticle.favorites.map((fav) => ({
      id: fav.id,
      userId: fav.userId,
      articleId: fav.articleId,
    })),
  } as Article;
};

export const deleteArticle = async (articleId: number): Promise<void> => {
  await articleRepository.delete(articleId);
};

export const addLike = async ({
  articleId,
  userId,
}: User_Article): Promise<Article> => {
  return articleRepository.createFavorite(
    articleId,
    userId
  ) as Promise<Article>;
};

export const deleteLike = async ({
  articleId,
  userId,
}: User_Article): Promise<Article> => {
  return articleRepository.deleteFavorite(
    articleId,
    userId
  ) as Promise<Article>;
};
