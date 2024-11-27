import { Prisma } from "@prisma/client";

import { UserCommentInfo } from "./user-types";

export interface ProductCommentCreateData {
  productId: string;
  content: string;
}

export interface ProductCommentListQuery {
  orderBy: string;
  page: number;
  pageSize: number;
}

export interface ProductCommentUpdateData {
  content: string;
}

interface BaseProductCommentParam {
  productId: string;
  userId: string;
  content: string;
}

export interface CreateProductCommentParam extends BaseProductCommentParam {}

export interface GetProductCommentListParam extends ProductCommentListQuery {
  productId: string;
}

export interface ModifyProductCommentParam {
  productCommentId: string;
  content: string;
}

export interface ProductCommentParam {
  userId: string;
  productCommentId: string;
}

interface ProductCommentCreateInput {
  data: Prisma.ProductCommentCreateInput;
}
interface ProductCommentUpdateInput {
  data: Prisma.ProductCommentUpdateInput;
}
interface ProductCommentSelect {
  select?: Prisma.ProductCommentSelect;
}
interface ProductCommentWhereUniqueInput {
  where: Prisma.ProductCommentWhereUniqueInput;
}
interface ProductCommentWhereInput {
  where: Prisma.ProductCommentWhereInput;
}
interface ProductCommentPagenationInput {
  orderBy: Prisma.ProductCommentOrderByWithRelationInput;
  // orderBy: { [id: string]: string };
  skip: number;
  take: number;
}

export interface ProductCommentData {
  id: string;
  productId: string;
  content: string;
  createdAt: Date;
  User: UserCommentInfo;
}

export interface ProductCommentCreateDataParam
  extends ProductCommentCreateInput,
    ProductCommentSelect {}

export interface ProductCommentFindUniqueOrThrowDataParam
  extends ProductCommentWhereUniqueInput,
    ProductCommentSelect {}

export interface ProductCommentFindManyByPaginationParam
  extends ProductCommentPagenationInput,
    ProductCommentWhereInput,
    ProductCommentSelect {}

export interface ProductCommentUpdateDataParam
  extends ProductCommentWhereUniqueInput,
    ProductCommentUpdateInput,
    ProductCommentSelect {}

export interface ProductCommentBaseInfo {
  id: string | null | undefined;
  productId: string | null | undefined;
  content: string | null | undefined;
  ownerId: string | null | undefined;
  ownerImage: string | null | undefined;
  ownerNickname: string | undefined;
  createdAt: Date | undefined;
}

export interface ProductCommentListInfo {
  totalCount: number;
  comments: ProductCommentBaseInfo[];
}
