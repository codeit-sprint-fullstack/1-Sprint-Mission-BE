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
