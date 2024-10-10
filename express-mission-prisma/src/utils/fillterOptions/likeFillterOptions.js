function createTypeFillterOptions(findData, type) {
  let fillterOptions;

  if (type === "article") {
    fillterOptions = {
      userId: findData.userId,
      articleId: findData.articleId,
    };
  } else if (type === "product") {
    fillterOptions = {
      userId: findData.userId,
      productId: findData.productId,
    };
  }

  return fillterOptions;
}

export default createTypeFillterOptions;
