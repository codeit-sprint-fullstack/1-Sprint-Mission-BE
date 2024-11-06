import { Article, Prisma } from "@prisma/client";
import articleRepository from "../repositories/article-repository";
import { PagenationQuery } from "../types/service-type";
import {
  articleKeywordfilterOtions,
  createPagefilterOptions,
} from "../utills/query-option";

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

export default {
  getArticleList,
};
