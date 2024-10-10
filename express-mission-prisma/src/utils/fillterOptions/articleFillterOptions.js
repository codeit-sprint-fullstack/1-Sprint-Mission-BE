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

export { createPageSizeFilterOptions, createKeywordFillterOtions };
