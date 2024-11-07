import productRepository from "../repositories/product-repository";
import { PagenationQuery } from "../types/service-type";
import {
  createPagefilterOptions,
  productKeywordfilterOtions,
} from "../utills/query-option";

// product 목록 조회
async function getProductList(query: PagenationQuery) {
  const KeyWordFilter = productKeywordfilterOtions(query);
  const pageFilterOption = createPagefilterOptions(query);
  const paginationParams = {
    where: KeyWordFilter,
    ...pageFilterOption,
  };
  const list = await productRepository.findManyByPaginationData({
    paginationParams,
  });
  const total = await productRepository.countData(KeyWordFilter);
  return { total, list };
}

export default {
  getProductList,
};
