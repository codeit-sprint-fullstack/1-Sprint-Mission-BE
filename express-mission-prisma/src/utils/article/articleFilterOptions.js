function createPageSizefilterOptions(query) {
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

  const filterOptions = {
    orderBy: { createdAt: "desc" },
    skip: parseInt(offset),
    take: parseInt(pageSizeNum),
    where: whereOr,
  };

  return filterOptions;
}

function createKeywordfilterOtions(query) {
  const { keyWord = "" } = query;

  const filterBody = {
    contains: keyWord,
    mode: "insensitive",
  };
  const filterOptions = {
    OR: [
      {
        title: filterBody,
      },
      {
        content: filterBody,
      },
    ],
  };

  return filterOptions;
}

export { createPageSizefilterOptions, createKeywordfilterOtions };
