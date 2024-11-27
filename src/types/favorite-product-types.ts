import { Prisma } from "@prisma/client";

export interface CreateFavoriteProductParam {
  userId: string;
  productId: string;
}

interface FavoriteProductCreateInput {
  data: Prisma.FavoriteProductCreateInput;
}
interface FavoriteProductSelect {
  select?: Prisma.FavoriteProductSelect;
}

export interface FavoriteProductCreateDataParam
  extends FavoriteProductCreateInput,
    FavoriteProductSelect {}
