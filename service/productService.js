import prismaClient from "../utils/prismaClient.js";
import { getTotalCount } from "../model/productModel.js";
import { getList } from "../model/productModel.js";

export async function getProducts({
  orderBy,
  page = 1,
  pageSize = 10,
  keyword = "",
}) {
  const offset = (page - 1) * pageSize; //page가 3이면 3-1 = 2 * count 만큼 스킵
  let orderOption;
  switch (orderBy) {
    case "recent":
      orderOption = { createAt: "desc" };
      break;
    case "favorite":
      orderOption = { favorite: "desc" };
      break;
    default:
      orderOption = { createAt: "desc" };
      break;
  }
  const [totalCount, products] = await Promise.all([
    getTotalCount(keyword),
    getList(pageSize, offset, orderOption, keyword),
  ]);
  const hasMore = totalCount - page * pageSize > 0;
  return { totalCount, products, hasMore };
}
