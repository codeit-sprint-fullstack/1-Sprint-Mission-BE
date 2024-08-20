import * as ss from "superstruct";

export const Article = ss.object({
  title: ss.string(),
  content: ss.string(),
});
