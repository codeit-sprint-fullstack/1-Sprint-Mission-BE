function createPageSizeFilterOptions(query) {
  const { page, pageSize, orderBy, keyWord = "" } = query;

  const pageNum = page || 1;
  const pageSizeNum = pageSize || 10;
  const order = orderBy || "recent";
  const offset = (pageNum - 1) * pageSizeNum;
  const whereOrBody = {
    contains: keyWord,
    mode: "insensitive",
  };
  const whereOr = {
    OR: [
      {
        title: whereOrBody,
      },
      {
        content: whereOrBody,
      },
    ],
  };

  const fillterOptions = {
    orderBy: { createdAt: "desc" },
    skip: parseInt(offset),
    take: parseInt(pageSizeNum),
    where: whereOr,
  };

  return fillterOptions;
}

function createCursorFilterOptions(id, query, type) {
  const { cursor = "", pageSize, orderBy } = query;
  const order = orderBy || "recent";
  let findValueDefault;

  if (type === "article") {
    let pageSizeNum = parseInt(pageSize) || 5;
    if (pageSizeNum) {
      pageSizeNum++;
    }
    findValueDefault = {
      orderBy: { createdAt: "desc" },
      take: pageSizeNum,
      where: { articleId: id },
    };
  } else if (type === "product") {
    let pageSizeNum = parseInt(pageSize) || 2;
    if (pageSizeNum) {
      pageSizeNum++;
    }
    findValueDefault = {
      orderBy: { createdAt: "desc" },
      take: pageSizeNum,
      where: { productId: id },
    };
  }

  const fillterOptions =
    cursor !== ""
      ? { ...findValueDefault, cursor: { id: cursor } }
      : { ...findValueDefault };

  return fillterOptions;
}

function createKeywordFillterOtions(query) {
  const { keyWord = "" } = query;

  const fillterBody = {
    contains: keyWord,
    mode: "insensitive",
  };
  const fillterOptions = {
    OR: [
      {
        title: fillterBody,
      },
      {
        content: fillterBody,
      },
    ],
  };

  return fillterOptions;
}

function createTypeFillterOptions(id, type) {
  let fillterOptions;

  if (type === "article") {
    fillterOptions = { articleId: id };
  } else if (type === "product") {
    fillterOptions = { productId: id };
  }

  return fillterOptions;
}

export {
  createPageSizeFilterOptions,
  createCursorFilterOptions,
  createKeywordFillterOtions,
  createTypeFillterOptions,
};
