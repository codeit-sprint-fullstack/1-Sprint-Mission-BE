import { ProductCommentData } from "../../types/product-comment-types";

export function productCommentMapper(data: ProductCommentData) {
  return {
    id: data.id,
    productId: data.productId,
    content: data.content,
    ownerId: data.User.id,
    ownerImage: data.User.image,
    ownerNickname: data.User.nickname,
    createdAt: data.createdAt,
  };
}

type productCommentMapperReturnType = ReturnType<typeof productCommentMapper>;

export function productCommentListMapper({
  count,
  productCommentList,
}: {
  count: number;
  productCommentList: ProductCommentData[];
}) {
  const mappedProductCommentList: productCommentMapperReturnType[] =
    productCommentList.map(productCommentMapper);
  return { totalCount: count, comments: mappedProductCommentList };
}
