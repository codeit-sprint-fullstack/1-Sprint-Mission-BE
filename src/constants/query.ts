const MIN_LENGTH_PAGE: number = 1;
const MIN_LENGTH_PAGE_NUM: number = 1;
enum ORDER_BY {
  recent = "recent",
  oldest = "oldest",
  favorite = "favorite",
}

export const queryLimit = {
  MIN_LENGTH_PAGE,
  MIN_LENGTH_PAGE_NUM,
  ORDER_BY,
};
