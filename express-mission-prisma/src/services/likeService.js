import likeRepository from "../repositories/likeRepository.js";
import createTypeFillterOptions from "../utils/fillterOptions/likeFillterOptions.js";
import {
  articleTransactionData,
  productTransactionData,
} from "../utils/prepareTransactionData.js";

async function getByFillter(findData, type) {
  const fillterOptions = createTypeFillterOptions(findData, type);
  return await likeRepository.getByFillter(fillterOptions);
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
  getByFillter,
  createArticleAndRelatedData,
  deleteArticleAndRelatedData,
  createProductAndRelatedData,
  deleteProductAndRelatedData,
};
