import { Prisma } from "@prisma/client";

export interface CreateFavoritePostParam {
  userId: string;
  postId: string;
}

interface FavoritePostCreateInput {
  data: Prisma.FavoritePostCreateInput;
}
interface FavoritePostSelect {
  select?: Prisma.FavoritePostSelect;
}

export interface FavoritePostCreateDataParam
  extends FavoritePostCreateInput,
    FavoritePostSelect {}
