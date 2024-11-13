import * as ss from "superstruct";

import { commentSchema } from "../constants/comment.js";

export const Comment = ss.object({
  content: ss.size(
    ss.string(),
    commentSchema.MIN_LENGTH_COMMENT,
    commentSchema.MAX_LENGTH_COMMENT
  ),
});
