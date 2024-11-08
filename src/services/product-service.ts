import productRepository from "../repositories/product-repository";
import { CursorQuery, PagenationQuery } from "../types/service-type";
import {
  createCursorFilterOptions,
  createPagefilterOptions,
  productKeywordfilterOtions,
} from "../utills/query-option";
import { Request } from "express";
import {
  createProductMapper,
  productDetailMapper,
} from "./mappers/product-mapper";
import { CreateProductWithUser } from "../controllers/product-controller";
import commentRepository from "../repositories/comment-repository";
import likeRepository from "../repositories/like-repository";

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
  const pagenationParams = {
    where: KeyWordFilter,
    ...pageFilterOption,
  };
  const list = await productRepository.findManyByPagenationData({
    pagenationParams,
  });
  const total = await productRepository.countData(KeyWordFilter);
  return { total, list };
}

// product 생성
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

// product 상세 조회
async function getProductDetail(
  req: Request<{ id: string }, {}, { userId: string | null }, CursorQuery>
) {
  const { id: productId } = req.params;
  const { pageSize = "" } = req.query;
  const { userId } = req.body;
  const product = await productRepository.findUniqueOrThrowtData({
    where: { id: productId },
  });
  const commmentOption = createCursorFilterOptions(
    productId,
    req.query,
    "product"
  );
  const comment = await commentRepository.findManyByCursorPagenationData({
    pagenationParams: commmentOption,
  });
  const commentTotal = await commentRepository.countData({ productId });
  const currentPageSize = parseInt(pageSize) || 2;

  let isLike: undefined | boolean;

  if (userId) {
    const like = await likeRepository.findFirstData({
      where: { userId, productId },
    });

    isLike = like ? true : false;
  }

  return productDetailMapper(
    product,
    comment,
    commentTotal,
    currentPageSize,
    isLike
  );
}

export default {
  getProductList,
  createProduct,
  getProductDetail,
};
