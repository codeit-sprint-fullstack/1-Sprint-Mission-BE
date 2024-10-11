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

  const filterOptions =
    cursor !== ""
      ? { ...findValueDefault, cursor: { id: cursor } }
      : { ...findValueDefault };

  return filterOptions;
}

function createTypefilterOptions(id, type) {
  let filterOptions;

  if (type === "article") {
    filterOptions = { articleId: id };
  } else if (type === "product") {
    filterOptions = { productId: id };
  }

  return filterOptions;
}

export { createCursorFilterOptions, createTypefilterOptions };
