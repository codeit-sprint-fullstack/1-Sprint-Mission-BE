import { Request, Response, NextFunction } from "express";

import postService from "../services/post-service";

import {
  PostCreateData,
  PostListQuery,
  PostUpdateData,
} from "../types/post-types";

async function createPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { name, content }: PostCreateData = req.body;
    const userId: string = res.locals.userId;
    const postInfo = await postService.createPost({ userId, name, content });

    res.status(201).send(postInfo);
  } catch (err) {
    next(err);
  }
}

async function getPostList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { orderBy, page, pageSize, keyword } =
      req.query as unknown as PostListQuery;
    const postListInfo = await postService.getPostList({
      userId,
      orderBy,
      page,
      pageSize,
      keyword,
    });

    res.status(200).send(postListInfo);
  } catch (err) {
    next(err);
  }
}

async function getPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { postId } = req.params as unknown as { postId: string };
    const postDetailInfo = await postService.getPost({ userId, postId });

    res.status(200).send(postDetailInfo);
  } catch (err) {
    next(err);
  }
}

async function modifyPost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { postId } = req.params as unknown as { postId: string };
    const { name, content }: PostUpdateData = req.body;
    const postUpdateInfo = await postService.modifyPost({
      userId,
      postId,
      name,
      content,
    });

    res.status(200).send(postUpdateInfo);
  } catch (err) {
    next(err);
  }
}

async function deletePost(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { postId } = req.params as unknown as { postId: string };
    const postDeleteInfo = await postService.deletePost(postId);

    res.status(204).send(postDeleteInfo);
  } catch (err) {
    next(err);
  }
}

async function increasePostFavorite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { postId } = req.params as unknown as { postId: string };
    const postUpdateInfo = await postService.increasePostFavorite({
      userId,
      postId,
    });

    res.status(200).send(postUpdateInfo);
  } catch (err) {
    next(err);
  }
}

async function decreasePostFavorite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId: string = res.locals.userId;
    const { postId } = req.params as unknown as { postId: string };
    const postUpdateInfo = await postService.decreasePostFavorite({
      userId,
      postId,
    });

    res.status(200).send(postUpdateInfo);
  } catch (err) {
    next(err);
  }
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
