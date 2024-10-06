import asyncHandler from '../utils/asyncHandler.js';
import { assert } from 'superstruct';
import { CreateProduct, PatchProduct } from '../structs.js';
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
  const product = await getProductTotalCountService({ search });
  res.send(product);
});

export const patchProductController = asyncHandler(async (req, res) => {
  assert(req.body, PatchProduct);
  const { id } = req.params;
  const product = await patchProductService({ id, body: req.body });
  res.send(product);
});

export const postProductController = asyncHandler(async (req, res) => {
  assert(req.body, CreateProduct);
  const { name, description, price, tags } = req.body;
  const product = await postProductService({ name, description, price, tags });
  res.send(product);
});

export const deleteProductController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteProductService({ id });
  res.send(204);
});
