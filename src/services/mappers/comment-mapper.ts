import { Comment } from "@prisma/client";

export function commentPagenationMapper(
  list: Comment[],
  total: number,
  pageSize: number
) {
  const lastComment: Comment | undefined = list[pageSize];
  const NextCusor = lastComment ? lastComment.id : "null";
  if (NextCusor !== "null") {
    list.pop();
  }

  return {
    cursorInfo: {
      total,
      NextCusor,
    },
    list,
  };
}
