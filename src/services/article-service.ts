import { Article } from "@prisma/client";
import articleRepository from "../repositories/article-repository";
import { PagenationQuery, UserId } from "../types/service-type";
import {
  articleKeywordfilterOtions,
  createPagefilterOptions,
} from "../utills/query-option";
import { CreateArticle } from "../struct/article-struct";
import likeRepository from "../repositories/like-repository";

// article 목록 조회
async function getArticleList(query: PagenationQuery) {
  const KeyWordFilter = articleKeywordfilterOtions(query);
  const pageFilterOption = createPagefilterOptions(query);
  const paginationParams = {
    where: KeyWordFilter,
    ...pageFilterOption,
  };
  const list: Article[] = await articleRepository.findManyByPaginationData({
    paginationParams,
  });
  const total: number = await articleRepository.countData(KeyWordFilter);
  return { total, list };
}

// article 생성
async function createArticle(data: UserId & CreateArticle) {
  return await articleRepository.createData({ data });
}

// article 상세 조회
async function getArticleDetail({
  articleId,
  userId,
}: {
  articleId: string;
  userId?: string;
}) {
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

export default {
  getArticleList,
  createArticle,
  getArticleDetail,
};
