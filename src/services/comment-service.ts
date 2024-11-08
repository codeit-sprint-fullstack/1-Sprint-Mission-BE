import { Request } from "express";
import { CursorQuery } from "../types/service-type";
import commentRepository from "../repositories/comment-repository";
import { createCursorFilterOptions } from "../utills/query-option";
import { commentPagenationMapper } from "./mappers/comment-mapper";

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

export default {
  getCommentListByArticle,
};
