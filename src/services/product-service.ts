import productRepository from "../repositories/product-repository";
import { PagenationQuery } from "../types/service-type";
import {
  createPagefilterOptions,
  productKeywordfilterOtions,
} from "../utills/query-option";
import { Request } from "express";
import { createProductMapper } from "./mappers/product-mapper";
import { CreateProductWithUser } from "../controllers/product-controller";

type CreateProducrData = CreateProductWithUser & {
  image: string[];
};

export type ImagePath = {
  [imgName: string]: string;
};

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

async function createProduct(req: Request<{}, {}, CreateProductWithUser>) {
  let createData: CreateProducrData;
  let imagePath: ImagePath = {};

  if (req.files && req.files.length > 0) {
    const imagePaths = req.files.map((file) => file.filename);

    createData = { ...req.body, image: imagePaths };

    req.files.map((file) => {
      imagePath[file.originalname] = file.path;
    });
  } else {
    createData = { ...req.body, image: [] };
  }

  const product = await productRepository.createData({ data: createData });
  return createProductMapper(product, imagePath);
}

export default {
  getProductList,
  createProduct,
};
