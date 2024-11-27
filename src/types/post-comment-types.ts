import { Prisma } from "@prisma/client";

import { UserCommentInfo } from "./user-types";

export interface PostCommentCreateData {
  postId: string;
  content: string;
}

export interface PostCommentListQuery {
  orderBy: string;
  page: number;
  pageSize: number;
}

export interface PostCommentUpdateData {
  content: string;
}

interface BasePostCommentParam {
  postId: string;
  userId: string;
  content: string;
}

export interface CreatePostCommentParam extends BasePostCommentParam {}

export interface GetPostCommentListParam extends PostCommentListQuery {
  postId: string;
}

export interface ModifyPostCommentParam {
  postCommentId: string;
  content: string;
}

export interface PostCommentParam {
  userId: string;
  postCommentId: string;
}

interface PostCommentCreateInput {
  data: Prisma.PostCommentCreateInput;
}
interface PostCommentUpdateInput {
  data: Prisma.PostCommentUpdateInput;
}
interface PostCommentSelect {
  select?: Prisma.PostCommentSelect;
}
interface PostCommentWhereUniqueInput {
  where: Prisma.PostCommentWhereUniqueInput;
}
interface PostCommentWhereInput {
  where: Prisma.PostCommentWhereInput;
}
interface PostCommentPagenationInput {
  orderBy: Prisma.PostCommentOrderByWithRelationInput;
  // orderBy: { [id: string]: string };
  skip: number;
  take: number;
}

export interface PostCommentData {
  id: string;
  postId: string;
  content: string;
  createdAt: Date;
  User: UserCommentInfo;
}

export interface PostCommentCreateDataParam
  extends PostCommentCreateInput,
    PostCommentSelect {}

export interface PostCommentFindUniqueOrThrowDataParam
  extends PostCommentWhereUniqueInput,
    PostCommentSelect {}

export interface PostCommentFindManyByPaginationParam
  extends PostCommentPagenationInput,
    PostCommentWhereInput,
    PostCommentSelect {}

export interface PostCommentUpdateDataParam
  extends PostCommentWhereUniqueInput,
    PostCommentUpdateInput,
    PostCommentSelect {}

export interface PostCommentBaseInfo {
  id: string | null | undefined;
  postId: string | null | undefined;
  content: string | null | undefined;
  ownerId: string | null | undefined;
  ownerImage: string | null | undefined;
  ownerNickname: string | undefined;
  createdAt: Date | undefined;
}

export interface PostCommentListInfo {
  totalCount: number;
  comments: PostCommentBaseInfo[];
}
