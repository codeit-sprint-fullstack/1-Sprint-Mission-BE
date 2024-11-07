import { Article } from "@prisma/client";
import articleRepository from "../repositories/article-repository";
import { PagenationQuery, UserId } from "../types/service-type";
import {
  articleKeywordfilterOtions,
  createPagefilterOptions,
} from "../utills/query-option";
import { CreateArticle, UpdateArticle } from "../struct/article-struct";
import likeRepository from "../repositories/like-repository";

// article 목록 조회
async function getArticleList(query: PagenationQuery) {
  const KeyWordFilter = articleKeywordfilterOtions(query);
  const pageFilterOption = createPagefilterOptions(query);
  const paginationParams = {
    where: KeyWordFilter,
    ...pageFilterOption,
  };
  const list = await articleRepository.findManyByPaginationData({
    paginationParams,
  });
  const total = await articleRepository.countData(KeyWordFilter);
  return { total, list };
}

// article 생성
async function createArticle(data: UserId & CreateArticle) {
  return await articleRepository.createData({ data });
}

// article 상세 조회
async function getArticleDetail(articleId: string, userId: string | undefined) {
  const article = await articleRepository.findUniqueOrThrowtData({
    where: { id: articleId },
  });
  if (userId) {
    const like = await likeRepository.findFirstData({
      where: { articleId, userId },
    });

    let isLike: boolean = false;
    if (like) {
      isLike = true;
    }

    return { ...article, isLike };
  }
  return article;
}

// article 수정
async function updateArticle(articleId: string, data: UpdateArticle) {
  return await articleRepository.updateData({
    where: { id: articleId },
    data,
  });
}

export default {
  getArticleList,
  createArticle,
  getArticleDetail,
  updateArticle,
};
