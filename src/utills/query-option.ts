import { CreatedAtOrder } from "../types/repository-type";
import { PaginationQuery } from "../types/service-type";

type KeyWordFilter = {
  contains: string;
  mode: "insensitive";
};

interface PageFilterOption {
  orderBy: CreatedAtOrder;
  skip: number;
  take: number;
}

function articleKeywordfilterOtions(
  query: PaginationQuery
) {
  const { keyWord = "" } = query;

  const filterBody: KeyWordFilter = {
    contains: keyWord,
    mode: "insensitive",
  };
  const filterOptions = {
    OR: [{ title: filterBody }, { content: filterBody }],
  };

  return filterOptions;
}

function productKeywordfilterOtions(query: PaginationQuery) {
  const { keyWord = "" } = query;

  const filterBody: KeyWordFilter = {
    contains: keyWord,
    mode: "insensitive",
  };

  const filterOptions = {
    OR: [{ name: filterBody }, { description: filterBody }],
  };

  return filterOptions;
}

function createPagefilterOptions(query: PaginationQuery) {
  const { page, pageSize, orderBy } = query;

  const pageNum: number = page || 1;
  const pageSizeNum: number = pageSize || 10;
  const order: string = orderBy || "recent";
  const offset: number = (pageNum - 1) * pageSizeNum;

  const filterOptions: PageFilterOption = {
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: pageSizeNum,
  };

  return filterOptions;
}

export {
  createPagefilterOptions,
  articleKeywordfilterOtions,
  productKeywordfilterOtions,
};
