import postCommentRepository from "../repositories/post-comment-repository";

import {
  CreatePostCommentParam,
  GetPostCommentListParam,
  ModifyPostCommentParam,
  PostCommentBaseInfo,
  PostCommentListInfo,
  PostCommentData,
} from "../types/post-comment-types";
import { postCommentSelect } from "./selectors/post-comment-select";
import {
  postCommentMapper,
  postCommentListMapper,
} from "./mappers/post-comment-mapper";

import { ORDER_BY, DEFAULT_ORDER_BY } from "../constants/sort";
import { DEFAULT_POST_TAKE } from "../constants/post";

async function createPostComment({
  userId,
  postId,
  content,
}: CreatePostCommentParam): Promise<PostCommentBaseInfo> {
  const data = {
    User: {
      connect: { id: userId },
    },
    Post: {
      connect: { id: postId },
    },
    content,
  };
  const result = (await postCommentRepository.createData({
    data,
    select: postCommentSelect,
  })) as PostCommentData;

  return postCommentMapper(result);
}

async function getPostCommentList({
  postId,
  orderBy,
  page,
  pageSize,
}: GetPostCommentListParam): Promise<PostCommentListInfo> {
  const PostCommentOrderBy = ORDER_BY[orderBy] || DEFAULT_ORDER_BY;
  const where = { postId };
  const iPage: number = parseInt(page as unknown as string) || 1;
  const iPageSize: number =
    parseInt(pageSize as unknown as string) || DEFAULT_POST_TAKE;
  const skip: number = (iPage - 1) * iPageSize;
  const take: number = iPageSize;
  const count: number = await postCommentRepository.countData(where);
  const postCommentList = (await postCommentRepository.findManyByPaginationData(
    {
      orderBy: PostCommentOrderBy,
      skip,
      take,
      where,
      select: postCommentSelect,
    }
  )) as PostCommentData[];

  return postCommentListMapper({ count, postCommentList });
}

async function getPostComment(
  postCommentId: string
): Promise<PostCommentBaseInfo> {
  const where = {
    id: postCommentId,
  };

  const result = await postCommentRepository.findUniqueOrThrowData({
    where,
    select: postCommentSelect,
  });
  // const result = (await postCommentRepository.findUniqueOrThrowData({
  //   where,
  //   select: postCommentSelect,
  // })) as PostCommentData;

  return postCommentMapper(result);
}

async function modifyPostComment({
  postCommentId,
  content,
}: ModifyPostCommentParam): Promise<PostCommentBaseInfo> {
  const where = {
    id: postCommentId,
  };
  const data = { content };

  const result = (await postCommentRepository.updateData({
    where,
    data,
    select: postCommentSelect,
  })) as PostCommentData;

  return postCommentMapper(result);
}

async function deletePostComment(postCommentId: string): Promise<void> {
  const where = { id: postCommentId };

  return await postCommentRepository.deleteData(where);
}

export default {
  createPostComment,
  getPostCommentList,
  getPostComment,
  modifyPostComment,
  deletePostComment,
};
