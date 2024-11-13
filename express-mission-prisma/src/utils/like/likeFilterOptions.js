function createTypefilterOptions(findData, type) {
  let filterOptions;

  if (type === "article") {
    filterOptions = {
      userId: findData.userId,
      articleId: findData.articleId,
    };
  } else if (type === "product") {
    filterOptions = {
      userId: findData.userId,
      productId: findData.productId,
    };
  }

  return filterOptions;
}

export default createTypefilterOptions;
