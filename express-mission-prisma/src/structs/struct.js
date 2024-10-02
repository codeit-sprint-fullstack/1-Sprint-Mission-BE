import * as s from "superstruct";
import isUuId from "is-uuid";

const Uuid = s.define("Uuid", (value) => isUuId.v4(value));

//게시판 유효성 검사
const noticeBoardBody = {
  title: s.size(s.string(), 1, Infinity),
  content: s.size(s.string(), 1, Infinity),
};

export const CreateNoticeBoard = s.object({
  ...noticeBoardBody,
});

export const PatchNoticeBoard = s.partial(
  s.object({
    ...noticeBoardBody,
  })
);

//자유게시판과 중고마켓 댓글 유효성 검사
export const PatchCommend = s.object({
  content: s.size(s.string(), 1, Infinity),
});

const commendBody = {
  content: s.size(s.string(), 1, Infinity),
};

//자유게시판 댓글 유효성 검사
export const CreateFreeCommend = s.object({
  ...commendBody,
  noticeBoardId: Uuid,
});

// 중고마켓 댓글 유효성 검사
export const CreateUsedCommend = s.object({
  ...commendBody,
  usedMarketId: Uuid,
});
