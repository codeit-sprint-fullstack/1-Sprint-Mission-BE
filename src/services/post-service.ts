import { Post } from "@prisma/client";

import prisma from "../repositories/prisma";
import postRepository from "../repositories/post-repository";
import postImageRepository from "../repositories/post-image-repository";
import favoritePostRepository from "../repositories/favorite-post-repository";
import {
  CreatePostParam,
  GetPostListParam,
  ModifyPostParam,
  PostFavoriteParam,
  PostBaseInfo,
  PostDetailInfo,
  PostListInfo,
  PostDetailData,
} from "../types/post-types";
import {
  postSelect,
  postFavoriteSelect,
  postDetailSelect,
} from "./selectors/post-select";
import {
  postMapper,
  postDetailMapper,
  postListMapper,
} from "./mappers/post-mapper";

import { ORDER_BY, DEFAULT_ORDER_BY } from "../constants/sort";
import { DEFAULT_POST_TAKE } from "../constants/post";

async function createPost({
  userId,
  name,
  content,
  images,
}: CreatePostParam): Promise<PostBaseInfo> {
  const result = await prisma.$transaction(async () => {
    const data = {
      User: {
        connect: { id: userId },
      },
      name,
      content,
    };
    const newPost = await postRepository.createData({
      data,
      select: postSelect,
    });

    if (images && images.length > 0 && newPost.id) {
      const imageListData = images?.map((image) => {
        return { postId: newPost.id, image } as {
          postId: string;
          image: string;
        };
      });

      await postImageRepository.createManyData(imageListData);
    }

    const where = { id: newPost.id };

    return await postRepository.findUniqueOrThrowData({
      where,
      select: postFavoriteSelect(userId),
    });
  });

  return postMapper(result);
}

async function getPostList({
  userId,
  orderBy,
  page,
  pageSize,
  keyword,
}: GetPostListParam): Promise<PostListInfo> {
  const postOrderBy = ORDER_BY[orderBy] || DEFAULT_ORDER_BY;
  const where = {
    ...(keyword && {
      OR: [{ name: { contains: keyword } }, { content: { contains: keyword } }],
    }),
  };
  const iPage: number = parseInt(page as unknown as string) || 1;
  const iPageSize: number =
    parseInt(pageSize as unknown as string) || DEFAULT_POST_TAKE;
  const skip: number = (iPage - 1) * iPageSize;
  const take: number = iPageSize;
  const count: number = await postRepository.countData(where);
  const postList: Partial<Post>[] =
    await postRepository.findManyByPaginationData({
      orderBy: postOrderBy,
      skip,
      take,
      where,
      select: postFavoriteSelect(userId),
    });

  return postListMapper({ count, postList });
}

async function getPost({
  userId,
  postId,
}: PostFavoriteParam): Promise<PostDetailInfo> {
  const where = {
    id: postId,
  };

  const result = await postRepository.findUniqueOrThrowData({
    where,
    select: postDetailSelect(userId),
  });

  return postDetailMapper(result as PostDetailData);
}

async function modifyPost({
  userId,
  postId,
  name,
  content,
  images,
}: ModifyPostParam): Promise<PostBaseInfo> {
  const result = await prisma.$transaction(async () => {
    if (images) {
      const imageListData = images?.map((image) => {
        return { postId, image };
      });

      await postImageRepository.deleteManyData({ postId });
      await postImageRepository.createManyData(imageListData);
    }

    const where = {
      id: postId,
    };
    const data = { ...(name && { name }), ...(content && { content }) };

    return await postRepository.updateData({
      where,
      data,
      select: postFavoriteSelect(userId),
    });
  });

  return postMapper(result);
}

async function deletePost(postId: string): Promise<void> {
  const where = { id: postId };

  return await postRepository.deleteData(where);
}

async function increasePostFavorite({ userId, postId }: PostFavoriteParam) {
  const postWhere = { id: postId };
  const postData = { favoriteCount: { increment: 1 } };
  const favoritePostData = {
    User: {
      connect: { id: userId },
    },
    Post: {
      connect: { id: postId },
    },
  };

  const result: Partial<Post> = await prisma.$transaction(async () => {
    await favoritePostRepository.createData({ data: favoritePostData });

    return await postRepository.updateData({
      where: postWhere,
      data: postData,
      select: postFavoriteSelect(userId),
    });
  });

  return postMapper(result);
}

async function decreasePostFavorite({ userId, postId }: PostFavoriteParam) {
  const postWhere = { id: postId };
  const postData = { favoriteCount: { decrement: 1 } };
  const favoritePostWhere = {
    userId_postId: {
      userId,
      postId,
    },
  };

  const result: Partial<Post> = await prisma.$transaction(async () => {
    await favoritePostRepository.deleteData(favoritePostWhere);

    return await postRepository.updateData({
      where: postWhere,
      data: postData,
      select: postFavoriteSelect(userId),
    });
  });

  return postMapper(result);
}

export default {
  createPost,
  getPostList,
  getPost,
  modifyPost,
  deletePost,
  increasePostFavorite,
  decreasePostFavorite,
};
