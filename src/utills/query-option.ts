import { CreatedAtOrder } from "../types/repository-type";
import { CursorQuery, PagenationQuery } from "../types/service-type";

type KeyWordFilter = {
  contains: string;
  mode: "insensitive";
};

interface PageFilterOption {
  orderBy: CreatedAtOrder;
  skip: number;
  take: number;
}

type CursorType = "product" | "article";

interface CursorDefaultOption {
  orderBy: CreatedAtOrder;
  take: number;
  where: { productId: string } | { articleId: string } | undefined;
}

function articleKeywordfilterOtions(query: PagenationQuery) {
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

function productKeywordfilterOtions(query: PagenationQuery) {
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

function createPagefilterOptions(query: PagenationQuery) {
  const { page = "", pageSize = "", orderBy } = query;

  const pageNum: number = parseInt(page) || 1;
  const pageSizeNum: number = parseInt(pageSize) || 10;
  const order: string = orderBy || "recent";
  const offset: number = (pageNum - 1) * pageSizeNum;

  const filterOptions: PageFilterOption = {
    orderBy: { createdAt: "desc" },
    skip: offset,
    take: pageSizeNum,
  };

  return filterOptions;
}

function createCursorFilterOptions(
  id: string,
  query: CursorQuery,
  type: CursorType
) {
  const { cursor = "", pageSize = "", orderBy } = query;
  const order = orderBy || "recent";
  let findValueDefault: CursorDefaultOption = {
    orderBy: { createdAt: "desc" },
    take: 0,
    where: undefined,
  };

  if (type === "article") {
    let pageSizeNum: number = parseInt(pageSize) || 5;
    if (pageSizeNum) {
      pageSizeNum++;
    }
    findValueDefault = {
      orderBy: { createdAt: "desc" },
      take: pageSizeNum,
      where: { articleId: id },
    };
  } else if (type === "product") {
    let pageSizeNum: number = parseInt(pageSize) || 2;
    if (pageSizeNum) {
      pageSizeNum++;
    }
    findValueDefault = {
      orderBy: { createdAt: "desc" },
      take: pageSizeNum,
      where: { productId: id },
    };
  }

  const filterOptions =
    cursor !== ""
      ? { ...findValueDefault, cursor: { id: cursor } }
      : { ...findValueDefault };

  return filterOptions;
}

export {
  createPagefilterOptions,
  articleKeywordfilterOtions,
  productKeywordfilterOtions,
  createCursorFilterOptions,
};
