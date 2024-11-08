import { Request } from "express";
import { CursorQuery } from "../types/service-type";
import commentRepository from "../repositories/comment-repository";
import { createCursorFilterOptions } from "../utills/query-option";
import { commentPagenationMapper } from "./mappers/comment-mapper";
import { Prisma } from "@prisma/client";

// article 댓글 목록 조회
async function getCommentListByArticle(
  req: Request<{ id: string }, {}, {}, CursorQuery>
) {
  const { id: articleId } = req.params;
  const { pageSize = "" } = req.query;

  const pagenationOption = createCursorFilterOptions(
    articleId,
    req.query,
    "article"
  );
  const list = await commentRepository.findManyByCursorPagenationData({
    pagenationParams: pagenationOption,
  });
  const total = await commentRepository.countData({ articleId });

  const currentPageSize = parseInt(pageSize) || 5;

  return commentPagenationMapper(list, total, currentPageSize);
}

// article 댓글 생성
async function createArticleComment(data: Prisma.CommentUncheckedCreateInput) {
  return await commentRepository.createData({ data });
}

// product 댓글 목록 조회
async function getCommentListByProduct(
  req: Request<{ id: string }, {}, {}, CursorQuery>
) {
  const { id: productId } = req.params;
  const { pageSize = "" } = req.query;

  const pagenationOption = createCursorFilterOptions(
    productId,
    req.query,
    "product"
  );
  const list = await commentRepository.findManyByCursorPagenationData({
    pagenationParams: pagenationOption,
  });
  const total = await commentRepository.countData({ productId });

  const currentPageSize = parseInt(pageSize) || 5;

  return commentPagenationMapper(list, total, currentPageSize);
}

export default {
  getCommentListByArticle,
  createArticleComment,
  getCommentListByProduct,
};
