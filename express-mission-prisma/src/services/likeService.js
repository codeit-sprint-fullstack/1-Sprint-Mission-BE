import likeRepository from "../repositories/likeRepository.js";

async function getByFillter(findData, type) {
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
  return await likeRepository.getByFillter(fillterOptions);
}

async function createArticleAndRelatedData(reqBody) {
  const transactionData = {
    likeIdentifiers: reqBody,
    countFillter: { articleId: reqBody.articleId },
    userId: reqBody.userId,
    articleId: reqBody.articleId,
  };
  return await likeRepository.createArticleAndRelatedData(transactionData);
}

async function createProductAndRelatedData(reqBody) {
  const transactionData = {
    createData: reqBody,
    countFillter: { productId: reqBody.productId },
    userId: reqBody.userId,
    productId: reqBody.productId,
  };
  return await likeRepository.createProductAndRelatedData(transactionData);
}

async function deleteArticleAndRelatedData(reqBody) {
  const transactionData = {
    likeIdentifiers: { id: reqBody.likeId },
    countFillter: { articleId: reqBody.articleId },
    userId: reqBody.userId,
    articleId: reqBody.articleId,
  };
  return await likeRepository.deleteArticleAndRelatedData(transactionData);
}

async function deleteProductAndRelatedData(reqBody) {
  const transactionData = {
    likeIdentifiers: { id: reqBody.likeId },
    countFillter: { productId: reqBody.productId },
    userId: reqBody.userId,
    productId: reqBody.productId,
  };
  return await likeRepository.deleteProductAndRelatedData(transactionData);
}

export default {
  getByFillter,
  createArticleAndRelatedData,
  createProductAndRelatedData,
  deleteArticleAndRelatedData,
  deleteProductAndRelatedData
};
