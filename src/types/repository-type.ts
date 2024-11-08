import { Prisma } from "@prisma/client";

type Sort = "asc" | "desc";

export interface CreatedAtOrder {
  createdAt?: Sort;
}

export interface PagenationParams {
  orderBy?: CreatedAtOrder;
  take?: number;
}
export interface PagenationParamsByPage extends PagenationParams {
  skip?: number;
}

export interface CommentPagenationParams extends PagenationParams {
  cursor?: Prisma.CommentWhereUniqueInput;
}
