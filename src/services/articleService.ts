import { setOrderByQuery } from "../utils/orderByQuery";
import articleRepository from "../repositorys/articleRepository";
import { whereConditions } from "../utils/interfaces/whereConditions";
import { Request } from "express";
import { CustomError } from "../utils/interfaces/customError";
import { ArticleData } from "../utils/interfaces/articles/articleData";
import cursorQueryString from "../utils/queryString/cursorQueryString";

const getArticles = async (req: Request) => {
  const query = req.query as unknown as cursorQueryString;
  const { orderBy = "recent", keyword = "", cursor = "", limit = "5" } = query;
  const parseLimit = parseInt(limit);
  const orderbyQuery = setOrderByQuery(orderBy);
  const whereConditions: whereConditions = {};
  if (keyword) {
    whereConditions.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { content: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const articles = await articleRepository.getArticles(
    cursor,
    parseLimit,
    whereConditions,
    orderbyQuery
  );

  if (!articles) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.message = "게시글을 찾지 못했습니다.";
    throw error;
  }
  //추가적인 데이터가 있는지 확인
  const nextArticles = articles.length > parseLimit;
  //추가 데이터가 있다면 커서값을 주고 데이터에서 리미트에 맞춰 돌려준다
  const nextCursor = nextArticles ? articles[parseLimit - 1].id : "";

  return {
    list: articles.slice(0, parseLimit),
    nextCursor,
  };
};

const getArticle = async (userId: string, articleId: string) => {
  const article = await articleRepository.findById(articleId);
  if (!article) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.message = "게시글을 찾지 못했습니다.";
    throw error;
  }
  //현재 사용자의 좋아요 상태를 확인 후 반환 -> 좋아요 상태가 아니면 null
  const existingLike = await articleRepository.existingLike(userId, articleId);
  return { article, existingLike };
};

const createArticle = async (data: ArticleData) => {
  const article = await articleRepository.createArticle(data);
  if (!article) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.message = "게시글을 찾지 못했습니다.";
    throw error;
  }
  return article;
};

const updateArticle = async (articleId: string, data: ArticleData) => {
  const article = await articleRepository.updateArticle(articleId, data);
  if (!article) {
    const error: CustomError = new Error("Not Found");
    error.status = 404;
    error.message = "게시글을 찾지 못했습니다.";
    throw error;
  }
  return article;
};

const likeArticle = async (userId: string, articleId: string) => {
  const article = await articleRepository.likeArticle(userId, articleId);
  return article;
};

const unlikeArticle = async (userId: string, articleId: string) => {
  const article = await articleRepository.unlikeArticle(userId, articleId);
  return article;
};

const deleteArticle = async (articleId: string) => {
  const article = await articleRepository.deleteArticle(articleId);
  if (!article) {
    const error: CustomError = new Error("Not Found");
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
