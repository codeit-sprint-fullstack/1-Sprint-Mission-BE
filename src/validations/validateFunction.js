export const areBothIds = (articleId, productId) => {
  if (articleId && productId) {
    const error = new Error(
      'Either articleId or productId should be provided, not both.'
    );
    error.code = 400;
    throw error;
  }
};

export const areBothIdsNull = (articleId, productId) => {
  if (!articleId && !productId) {
    const error = new Error(
      'Either articleId or productId should be provided.'
    );
    error.status = 400;
    throw error;
  }
};
