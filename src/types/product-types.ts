import { Prisma } from "@prisma/client";

import { productSelect } from "../services/selectors/product-select";
import { UserCommentInfo } from "./user-types";

export interface ProductCreateData {
  name: string;
  description: string;
  price: string;
  images?: string[];
  tags?: string[];
}

export interface ProductListQuery {
  orderBy: string;
  page: number;
  pageSize: number;
  keyword: string;
}

export interface ProductUpdateData {
  name: string;
  description: string;
  price: string;
  images?: string[];
  tags?: string[];
}

interface BaseProductParam {
  name: string;
  description: string;
  price: number;
  images?: string[];
  tags?: string[];
  favoriteCount?: number;
}

export interface CreateProductParam extends BaseProductParam {
  userId: string;
}

export interface GetProductListParam extends ProductListQuery {
  userId: string;
}

export interface ModifyProductParam
  extends BaseProductParam,
    ProductFavoriteParam {}

export interface ProductFavoriteParam {
  userId: string;
  productId: string;
}

interface ProductCreateInput {
  data: Prisma.ProductCreateInput;
}
interface ProductUpdateInput {
  data: Prisma.ProductUpdateInput;
}
interface ProductSelect {
  select?: Prisma.ProductSelect;
}
interface ProductWhereUniqueInput {
  where: Prisma.ProductWhereUniqueInput;
}
interface ProductWhereInput {
  where: Prisma.ProductWhereInput;
}
interface ProductPagenationInput {
  orderBy: Prisma.ProductOrderByWithRelationInput;
  // orderBy: { [id: string]: string };
  skip: number;
  take: number;
}

export interface ProductCreateDataParam
  extends ProductCreateInput,
    ProductSelect {}

export interface ProductFindUniqueOrThrowDataParam
  extends ProductWhereUniqueInput,
    ProductSelect {}

export interface ProductFindManyByPaginationParam
  extends ProductPagenationInput,
    ProductWhereInput,
    ProductSelect {}

export interface ProductUpdateDataParam
  extends ProductWhereUniqueInput,
    ProductUpdateInput,
    ProductSelect {}

export type ProductData = Partial<
  Prisma.ProductGetPayload<{
    select: typeof productSelect;
  }>
>;

interface ProductCommentData {
  id: string;
  content: string;
  createdAt: Date;
  User: UserCommentInfo;
}

export interface ProductDetailData {
  id: string;
  name: string;
  description: string;
  price: number;
  ProductTag: { tag: string }[];
  favoriteCount: number;
  createdAt: Date;
  ProductImage: { image: string }[];
  User: {
    id: string;
    nickname: string;
    image: string | null;
  };
  FavoriteProduct?: { id: string }[];
  ProductComment?: ProductCommentData[];
}

export interface ProductBaseInfo {
  id: string | null | undefined;
  name: string | null | undefined;
  description: string | null | undefined;
  price: number | null | undefined;
  favoriteCount: number | null | undefined;
  images: string[] | null | undefined;
  ownerId: string | null | undefined;
  ownerImage: string | null | undefined;
  ownerNickname: string | undefined;
  isFavorite: boolean | undefined;
  createdAt: Date | undefined;
}

export interface ProductDetailInfo extends ProductBaseInfo {
  comments:
    | Array<{
        id: string;
        content: string;
        createdAt: Date;
        ownerId: string;
        ownerImage: string | null;
        ownerNickname: string;
      }>
    | undefined;
}

export interface ProductListInfo {
  totalCount: number;
  products: ProductBaseInfo[];
}
