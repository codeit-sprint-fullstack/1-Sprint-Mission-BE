import asyncHandler from '../utils/asyncHandler.js';
import {
  deleteProductService,
  getProductListService,
  getProductService,
  getProductTotalCountService,
  patchProductService,
  postProductService,
} from '../service/productService.js';

export const getProductController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await getProductService({ id });
  res.send(product);
});

export const getProductListController = asyncHandler(async (req, res) => {
  const { offset = 0, limit = 10, order = 'recent', search = '' } = req.query;
  const product = await getProductListService({ offset, limit, order, search });
  res.send(product);
});

export const getProductTotalCountController = asyncHandler(async (req, res) => {
  const { search = '' } = req.query;
  const totalCount = await getProductTotalCountService({ search });
  res.send({ totalCount });
});

export const patchProductController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await patchProductService({ id, body: req.body });
  res.send(product);
});

export const postProductController = asyncHandler(async (req, res) => {
  const { name, description, price, tags, imageUrls } = req.body;
  const product = await postProductService({
    name,
    description,
    price,
    tags,
    imageUrls,
  });
  res.send(product);
});

export const deleteProductController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteProductService({ id });
  res.send(204);
});
