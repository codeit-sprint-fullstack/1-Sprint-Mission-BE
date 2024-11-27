import { Request, Response, NextFunction } from "express";

import postCommentService from "../services/post-comment-service";

import {
  PostCommentCreateData,
  PostCommentListQuery,
  PostCommentUpdateData,
} from "../types/post-comment-types";

async function createPostComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { postId, content }: PostCommentCreateData = req.body;
    const userId: string = res.locals.userId;
    const postCommentInfo = await postCommentService.createPostComment({
      userId,
      postId,
      content,
    });

    res.status(201).send(postCommentInfo);
  } catch (err) {
    next(err);
  }
}

async function getPostCommentList(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { postId } = req.params;
    const { orderBy, page, pageSize } =
      req.query as unknown as PostCommentListQuery;
    const postCommentListInfo = await postCommentService.getPostCommentList({
      postId,
      orderBy,
      page,
      pageSize,
    });

    res.status(200).send(postCommentListInfo);
  } catch (err) {
    next(err);
  }
}

async function getPostComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { postCommentId } = req.params as unknown as {
      postCommentId: string;
    };
    const postCommentDetailInfo = await postCommentService.getPostComment(
      postCommentId
    );

    res.status(200).send(postCommentDetailInfo);
  } catch (err) {
    next(err);
  }
}

async function modifyPostComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { postCommentId } = req.params as unknown as {
      postCommentId: string;
    };
    const { content }: PostCommentUpdateData = req.body;
    const postCommentUpdateInfo = await postCommentService.modifyPostComment({
      postCommentId,
      content,
    });

    res.status(200).send(postCommentUpdateInfo);
  } catch (err) {
    next(err);
  }
}

async function deletePostComment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { postCommentId } = req.params as unknown as {
      postCommentId: string;
    };
    const postCommentDeleteInfo = await postCommentService.deletePostComment(
      postCommentId
    );

    res.status(204).send(postCommentDeleteInfo);
  } catch (err) {
    next(err);
  }
}

export default {
  createPostComment,
  getPostCommentList,
  getPostComment,
  modifyPostComment,
  deletePostComment,
};
