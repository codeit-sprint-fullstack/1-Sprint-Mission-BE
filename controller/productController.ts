import asyncHandler from "../utils/asyncHandler";
import {
  deleteProductService,
  getProductListService,
  getProductService,
  getProductTotalCountService,
  patchProductService,
  postProductService,
} from "../service/productService";
import { Request, RequestHandler, Response } from "express";
import {
  ParsedProductListParams,
  ProductCreate,
  ProductIdParam,
  ProductListParams,
  ProductSearchParam,
} from "../dto/product.dto";

export const getProductController = asyncHandler(
  async (req: Request<ProductIdParam>, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const product = await getProductService({ id });
    res.send(product);
  }
);

export const getProductListController = asyncHandler(
  async (req: Request<{}, {}, {}, ProductListParams>, res: Response) => {
    const {
      offset = "0",
      limit = "10",
      order = "recent",
      search = "",
    } = req.query;
    const productListParams: ParsedProductListParams = {
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10),
      order,
      search,
    };
    const product = await getProductListService(productListParams);
    res.send(product);
  }
);

export const getProductTotalCountController: RequestHandler = asyncHandler(
  async (req, res) => {
    const { search = "" } = req.query as unknown as ProductSearchParam;
    const totalCount = await getProductTotalCountService({ search });
    res.send({ totalCount });
  }
);

export const patchProductController: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params as unknown as ProductIdParam;
    const product = await patchProductService({ id, body: req.body });
    res.send(product);
  }
);

export const postProductController: RequestHandler = asyncHandler(
  async (req, res) => {
    const { name, description, price, tags, imageUrls } =
      req.body as ProductCreate;
    const product = await postProductService({
      name,
      description,
      price,
      tags,
      imageUrls,
    });
    res.send(product);
  }
);

export const deleteProductController: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params as unknown as ProductIdParam;
    await deleteProductService({ id });
    res.send(204);
  }
);
