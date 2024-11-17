import { Product as PrismaProduct } from "@prisma/client";
import { ParsedQs } from "qs";

type ProductParamsBase = {
  offset: string;
  limit: string;
  order: string;
  search: string;
};

export type ProductIdParam = { id: string };

export type ParsedProductIdParam = Pick<PrismaProduct, "id">;

export type ProductCreate = Pick<
  PrismaProduct,
  "name" | "description" | "price" | "tags"
> & { imageUrls: string[] };

export interface ProductListParams
  extends ParsedQs,
    Partial<ProductParamsBase> {}

export type ProductSearchParam = Pick<ProductParamsBase, "search">;

export interface ParsedProductListParams {
  offset: number;
  limit: number;
  order: string;
  search: string;
}
