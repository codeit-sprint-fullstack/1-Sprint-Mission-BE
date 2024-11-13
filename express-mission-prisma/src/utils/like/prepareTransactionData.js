function productTransactionData(reqBody, method) {
  const { productId, likeId, userId } = reqBody;
  const commonOptions = {
    countfilter: { productId },
    userId,
    productId,
  };

  if (method === "post") {
    return {
      likeIdentifiers: reqBody,
      ...commonOptions,
    };
  } else if (method === "delete") {
    return {
      likeIdentifiers: { id: likeId },
      ...commonOptions,
    };
  }
}

function articleTransactionData(reqBody, method) {
  const { articleId, likeId, userId } = reqBody;
  const commonOptions = {
    countfilter: { articleId },
    userId,
    articleId,
  };

  if (method === "post") {
    return {
      likeIdentifiers: reqBody,
      ...commonOptions,
    };
  } else if (method === "delete") {
    return {
      likeIdentifiers: { id: likeId },
      ...commonOptions,
    };
  }
}

export { productTransactionData, articleTransactionData };
