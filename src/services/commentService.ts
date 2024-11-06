import commentRepository from "../repositorys/commentRepository";
import { Request } from "express";
import { CustomError } from "../utils/interfaces/customError";
import { Comment } from "@prisma/client";

const getArticleComments = async (req: Request) => {
  const { limit = 5, cursor = "" } = req.query;
  const { id } = req.params;

  const parseLimit = parseInt(limit as string);

  const comments = await commentRepository.getArticleComments(
    cursor as string,
    parseInt(limit as string),
    id
  );

  if (comments) {
    const nextComments = comments.length > parseLimit;
    const nextCursor = nextComments ? comments[parseLimit - 1].id : null;

    const returnData = {
      list: comments.slice(0, parseLimit),
      nextCursor,
    };
    return returnData;
  } else {
    const error: CustomError = new Error("Not found");
    error.status = 404;
    error.message = "댓글 리스트를 찾지 못했습니다.";
    throw error;
  }
};

const getProductComments = async (req: Request) => {
  const { limit = 5, cursor = "" } = req.query;
  const { id } = req.params;

  const parseLimit = parseInt(limit as string);

  const comments = await commentRepository.getProductComments(
    cursor as string,
    parseLimit,
    id
  );

  if (comments) {
    const nextComments = comments.length > parseLimit;
    const nextCursor = nextComments ? comments[parseLimit - 1].id : null;

    const returnData = {
      list: comments.slice(0, parseLimit),
      nextCursor,
    };
    return returnData;
  } else {
    const error: CustomError = new Error("Not found");
    error.status = 404;
    error.message = "댓글 리스트를 찾지 못했습니다.";
    throw error;
  }
};

const createComment = async (data: Comment) => {
  const comment = await commentRepository.createComment(data);
  if (!comment) {
    const error: CustomError = new Error("Not found");
    error.status = 404;
    error.message = "댓글 작성에 실패했습니다.";
    throw error;
  }
  return comment;
};

const updateComment = async (id: string, data: Comment) => {
  const comment = await commentRepository.updateComment(id, data);
  if (!comment) {
    const error: CustomError = new Error("Not found");
    error.status = 404;
    error.message = "댓글 수정에 실패했습니다.";
    throw error;
  }
  return comment;
};

const deleteComment = async (id: string) => {
  const comment = await commentRepository.deleteComment(id);
  if (!comment) {
    const error: CustomError = new Error("Not found");
    error.status = 404;
    error.message = "댓글 삭제에 실패했습니다.";
    throw error;
  }
  return comment;
};

export default {
  getArticleComments,
  getProductComments,
  createComment,
  updateComment,
  deleteComment,
};
