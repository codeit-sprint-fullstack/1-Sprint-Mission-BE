import { Prisma } from "@prisma/client";

import { postSelect } from "../services/selectors/post-select";
import { PostCommentData } from "./post-comment-types";

export interface PostCreateData {
  name: string;
  content: string;
  images?: string[];
}

export interface PostListQuery {
  orderBy: string;
  page: number;
  pageSize: number;
  keyword: string;
}

export interface PostUpdateData {
  name: string;
  content: string;
}

interface BasePostParam {
  name: string;
  content: string;
  images?: string[];
}

export interface CreatePostParam extends BasePostParam {
  userId: string;
}

export interface GetPostListParam extends PostListQuery {
  userId: string;
}

export interface ModifyPostParam extends BasePostParam, PostFavoriteParam {}

export interface PostFavoriteParam {
  userId: string;
  postId: string;
}

interface PostCreateInput {
  data: Prisma.PostCreateInput;
}
interface PostUpdateInput {
  data: Prisma.PostUpdateInput;
}
interface PostSelect {
  select?: Prisma.PostSelect;
}
interface PostWhereUniqueInput {
  where: Prisma.PostWhereUniqueInput;
}
interface PostWhereInput {
  where: Prisma.PostWhereInput;
}
interface PostPagenationInput {
  orderBy: Prisma.PostOrderByWithRelationInput;
  // orderBy: { [id: string]: string };
  skip: number;
  take: number;
}

export interface PostCreateDataParam extends PostCreateInput, PostSelect {}

export interface PostFindUniqueOrThrowDataParam
  extends PostWhereUniqueInput,
    PostSelect {}

export interface PostFindManyByPaginationParam
  extends PostPagenationInput,
    PostWhereInput,
    PostSelect {}

export interface PostUpdateDataParam
  extends PostWhereUniqueInput,
    PostUpdateInput,
    PostSelect {}

export type PostData = Partial<
  Prisma.PostGetPayload<{
    select: typeof postSelect;
  }>
>;

export interface PostDetailData {
  id: string;
  name: string;
  content: string;
  favoriteCount: number;
  createdAt: Date;
  PostImage?: { image: string }[];
  User?: {
    id: string;
    nickname: string;
    image: string | null;
  };
  FavoritePost?: { id: string }[];
  PostComment?: PostCommentData[];
}

export interface PostBaseInfo {
  id: string | null | undefined;
  name: string | null | undefined;
  content: string | null | undefined;
  favoriteCount: number | null | undefined;
  images: string[] | null | undefined;
  ownerId: string | null | undefined;
  ownerImage: string | null | undefined;
  ownerNickname: string | undefined;
  isFavorite: boolean | undefined;
  createdAt: Date | undefined;
}

export interface PostDetailInfo extends PostBaseInfo {
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

export interface PostListInfo {
  totalCount: number;
  posts: PostBaseInfo[];
}
