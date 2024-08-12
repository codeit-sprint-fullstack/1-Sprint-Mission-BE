import * as s from "superstruct";

//게시판 유효성 검사
export const CreateNoticeBoard = s.object({
  title: s.size(s.string(), 1, Infinity),
  content: s.size(s.string(), 1, Infinity),
});

//게시판 유효성 검사
export const PatchNoticeBoard = s.partial(CreateNoticeBoard);

//댓글 유효성 검사
export const UpsertCommend = s.object({
  content: s.size(s.string(), 1, Infinity),
});
