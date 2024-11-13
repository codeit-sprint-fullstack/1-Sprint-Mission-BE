import prisma from "./prisma.js";
import {
  postSelect,
  PostFavoriteSelect,
  postDetailSelect,
} from "../responses/post-res.js";
import { getPostQueryFilter, getPostSearchFilter } from "../utils/postUtil.js";

async function createPost(postData) {
  return await prisma.post.create({ data: postData, select: postSelect });
}

async function getPostsInfoByQuery({ userId, query }) {
  const filter = getPostQueryFilter(query);
  const select = userId ? PostFavoriteSelect(userId) : postSelect;

  return await prisma.post.findMany({
    ...filter,
    select: select,
  });
}

async function getPostsInfoByKeywordTotalCount(keyword) {
  const filter = getPostSearchFilter(keyword);

  return await prisma.post.count({
    where: {
      ...filter,
    },
  });
}

async function getPostDetailByPostId(postId) {
  const select = userId ? PostFavoriteSelect(userId) : postSelect;

  return await prisma.post.findFirstOrThrow({
    where: { id: postId },
    select: select,
  });
}

async function updatePost({ postId, updatedPostData }) {
  return prisma.post.update({
    where: { id: postId },
    data: updatedPostData,
    select: postDetailSelect,
  });
}

async function deletePost(postId) {
  return prisma.post.delete({ where: { id: postId } });
}

async function increasePostFavoriteCount({ userId, postId }) {
  const updatePostTransaction = prisma.post.update({
    where: { id: postId },
    data: {
      favoriteCount: {
        increment: 1,
      },
    },
    select: PostFavoriteSelect(userId),
  });
  const createFavoritePostTransaction = prisma.favoritePost.create({
    data: { userId, postId },
  });
  const [updatePost, createFavoritePost] = await prisma.$transaction([
    updatePostTransaction,
    createFavoritePostTransaction,
  ]);

  return updatePost;
}

async function decreasePostFavoriteCount({ userId, postId }) {
  const updatePostTransaction = prisma.post.update({
    where: { id: postId },
    data: {
      favoriteCount: {
        decrement: 1,
      },
    },
    select: PostFavoriteSelect(userId),
  });
  const deleteFavoritePostTransaction = prisma.favoritePost.delete({
    data: { userId, postId },
  });
  const [updatePost, deleteFavoritePost] = await prisma.$transaction([
    updatePostTransaction,
    deleteFavoritePostTransaction,
  ]);

  return updatePost;
}

export default {
  createPost,
  getPostsInfoByQuery,
  getPostsInfoByKeywordTotalCount,
  getPostDetailByPostId,
  updatePost,
  deletePost,
  increasePostFavoriteCount,
  decreasePostFavoriteCount,
};
