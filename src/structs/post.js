import * as ss from "superstruct";

import { postSchema } from "../constants/post";

export const Post = ss.object({
  title: ss.size(
    ss.string(),
    postSchema.MIN_LENGTH_TITLE,
    postSchema.MAX_LENGTH_TITLE
  ),
  content: ss.size(
    ss.string(),
    postSchema.MIN_LENGTH_CONTENT,
    postSchema.MAX_LENGTH_CONTENT
  ),
});
