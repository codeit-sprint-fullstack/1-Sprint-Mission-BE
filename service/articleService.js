import { setOrderByQuery } from "../utils/orderByQuery";
import articleModel from "../model/articleModel";

const getArticles = async (query) => {
  const { orderBy = "recent", keyword = "", cursor = "" } = req.query;
  const limit = parseInt(req.query.limit) || 10;
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
    const error = new Error("Bad request");
    error.status = 400;
    throw error;
  }

  const nextArticles = articles.length > limit;
  const nextCursor = nextArticles ? articles[limit - 1].id : "";

  return {
    list: articles.slice(0, limit),
    nextCursor,
  };
};

const getArticle = async (articleId) => {
  const article = await articleModel.getArticle(articleId);
  if (!article) {
    const error = new Error("Not Found");
    error.status = 404;
    throw error;
  }
  return article;
};

const updateArticle = async (articleId) => {
  const article = await articleModel.updateArticle(articleId);
  if (!article) {
    const error = new Error("Not Found");
    error.status = 404;
    throw error;
  }
  return article;
};

const createArticle = async (data) => {
  const article = await articleModel.createArticle(data);
  if (!article) {
    const error = new Error("Bad request");
    error.status = 400;
    throw error;
  }
  return article;
};

const deleteArticle = async (articleId) => {
  const article = await articleModel.deleteArticle(articleId);
  if (!article) {
    const error = new Error("Not Found");
    error.status = 404;
    throw error;
  }
  return article;
};

export default {
  getArticles,
  getArticle,
  updateArticle,
  createArticle,
  deleteArticle,
};
