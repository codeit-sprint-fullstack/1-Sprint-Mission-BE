import { setOrderByQuery } from "../utils/orderByQuery.js";
import articleModel from "../model/articleModel.js";

const getArticles = async (query) => {
  const { orderBy = "recent", keyword = "", cursor = "" } = query;
  const limit = parseInt(query.limit) || 10;
  // const offset = parseInt(req.query.offset) - 1 || 0;
  const orderbyQuery = setOrderByQuery(orderBy);

  const whereConditions = {};
  if (keyword) {
    whereConditions.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { content: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const articles = await articleModel.getArticles({
    cursor,
    limit,
    whereConditions,
    orderbyQuery,
  });

  if (!articles) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "게시글을 찾지 못했습니다.";
    throw error;
  }
  //추가적인 데이터가 있는지 확인
  const nextArticles = articles.length > limit;
  //추가 데이터가 있다면 커서값을 주고 데이터에서 리미트에 맞춰 돌려준다
  const nextCursor = nextArticles ? articles[limit - 1].id : "";

  return {
    list: articles.slice(0, limit),
    nextCursor,
  };
};

const getArticle = async ({ userId, articleId }) => {
  const article = await articleModel.findById(articleId);
  if (!article) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "게시글을 찾지 못했습니다.";
    throw error;
  }
  //현재 사용자의 좋아요 상태를 확인 후 반환 -> 좋아요 상태가 아니면 null
  const existingLike = await articleModel.existingLike(userId, articleId);
  return { article, existingLike };
};

const updateArticle = async ({ articleId, data }) => {
  const article = await articleModel.updateArticle(articleId, data);
  if (!article) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "게시글을 찾지 못했습니다.";
    throw error;
  }
  return article;
};

const likeArticle = async ({ articleId, userId }) => {
  const article = await articleModel.likeArticle({ articleId, userId });
  return article;
};

const unlikeArticle = async ({ articleId, userId }) => {
  const article = await articleModel.unlikeArticle({ articleId, userId });
  return article;
};

const createArticle = async (data) => {
  const article = await articleModel.createArticle({
    data,
  });
  if (!article) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "게시글을 찾지 못했습니다.";
    throw error;
  }
  return article;
};

const deleteArticle = async (articleId) => {
  const article = await articleModel.deleteArticle(articleId);
  if (!article) {
    const error = new Error("Not Found");
    error.status = 404;
    error.message = "게시글을 찾지 못했습니다.";
    throw error;
  }
  return article;
};

export default {
  getArticles,
  getArticle,
  updateArticle,
  likeArticle,
  unlikeArticle,
  createArticle,
  deleteArticle,
};
