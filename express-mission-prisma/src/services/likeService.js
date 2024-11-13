import likeRepository from "../repositories/likeRepository.js";
import createTypefilterOptions from "../utils/like/likeFilterOptions.js";
import {
  articleTransactionData,
  productTransactionData,
} from "../utils/like/prepareTransactionData.js";

async function getByfilter(findData, type) {
  const filterOptions = createTypefilterOptions(findData, type);
  return await likeRepository.getByfilter(filterOptions);
}

async function createArticleAndRelatedData(reqBody) {
  const transactionData = articleTransactionData(reqBody, "post");
  return await likeRepository.createArticleAndRelatedData(transactionData);
}

async function deleteArticleAndRelatedData(reqBody) {
  const transactionData = articleTransactionData(reqBody, "delete");
  return await likeRepository.deleteArticleAndRelatedData(transactionData);
}

async function createProductAndRelatedData(reqBody) {
  const transactionData = productTransactionData(reqBody, "post");
  return await likeRepository.createProductAndRelatedData(transactionData);
}

async function deleteProductAndRelatedData(reqBody) {
  const transactionData = productTransactionData(reqBody, "delete");
  return await likeRepository.deleteProductAndRelatedData(transactionData);
}

export default {
  getByfilter,
  createArticleAndRelatedData,
  deleteArticleAndRelatedData,
  createProductAndRelatedData,
  deleteProductAndRelatedData,
};
