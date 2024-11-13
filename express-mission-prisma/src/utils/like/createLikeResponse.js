function createArticleLikeResponse(transactionTasks, method) {
  const [like, likeCount, user, article] = transactionTasks;
  const resData = {
    updatedAt: like.updatedAt,
    createdAt: like.createdAt,
    likeCount: likeCount,
    writer: {
      nickname: user.nickname,
      id: user.id,
    },
    content: article.content,
    title: article.title,
    id: article.id,
  };

  let responseWithLikeStatus;
  if (method === "post") {
    responseWithLikeStatus = { ...resData, isLike: true };
  } else if (method === "delete") {
    responseWithLikeStatus = { ...resData, isLike: false };
  }

  return responseWithLikeStatus;
}

function createProductLikeResponse(transactionTasks, method) {
  const [like, likeCount, user, product] = transactionTasks;

  const resData = {
    createdAt: like.createdAt,
    favoriteCount: likeCount,
    ownerNickname: user.nickname,
    ownerId: user.id,
    images: product.image,
    tags: product.tags,
    price: product.price,
    description: product.description,
    name: product.name,
    id: product.id,
  };

  let responseWithLikeStatus;
  if (method === "post") {
    responseWithLikeStatus = { ...resData, isLike: true };
  } else if (method === "delete") {
    responseWithLikeStatus = { ...resData, isLike: false };
  }

  return responseWithLikeStatus;
}

export { createArticleLikeResponse, createProductLikeResponse };
