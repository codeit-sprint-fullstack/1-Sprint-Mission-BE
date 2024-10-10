import likeRepository from "../repositories/likeRepository.js";

async function create(createData) {
  return await likeRepository.create(createData);
}

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

async function countByFillter(findData, type) {
  let fillterOptions;
  if (type === "article") {
    fillterOptions = {
      articleId: findData.articleId,
    };
  } else if (type === "product") {
    fillterOptions = {
      productId: findData.productId,
    };
  }
  return await likeRepository.countByFillter(fillterOptions);
}

async function fetchArticleAndRelatedData(reqBody) {
  const transactionData = {
    createData: reqBody,
    countFillter: { articleId: reqBody.articleId },
    userId: reqBody.userId,
    articleId: reqBody.articleId,
  };
  return await likeRepository.fetchArticleAndRelatedData(transactionData);
}

export default {
  create,
  getByFillter,
  countByFillter,
  fetchArticleAndRelatedData,
};
