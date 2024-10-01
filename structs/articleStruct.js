import * as s from "superstruct";
import isUuid from "is-uuid";

const uuid = s.define("Uuid", (value) => isUuid.v4(value) || value === "");

export const createArticle = s.object({
  title: s.size(s.string(), 1, 15),
  content: s.size(s.string(), 1, 100),
  // userId: Uuid, 쿠키로전달 받은 값으로 서버에서 사용자정보를 작성
});

export const updateArticle = s.partial(createArticle);
