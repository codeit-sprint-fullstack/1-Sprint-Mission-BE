import { Article } from "@prisma/client";
import articleRepository from "../repositories/article-repository";
import { PagenationQuery, UserId } from "../types/service-type";
import {
  articleKeywordfilterOtions,
  createPagefilterOptions,
} from "../utills/query-option";
import { CreateArticle } from "../struct/article-struct";

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

async function createArticle(data: UserId & CreateArticle) {
  return await articleRepository.createData({ data });
}

export default {
  getArticleList,
  createArticle,
};
