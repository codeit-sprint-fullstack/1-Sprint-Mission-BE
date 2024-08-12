import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // data 초기화
  await prisma.articleComment.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.productComment.deleteMany({});
  await prisma.product.deleteMany({});

  // 게시글 1
  const article1 = await prisma.article.create({
    data: {
      title: "첫 번째 게시글",
      content: "이것은 첫 번째 게시글의 내용입니다.",
    },
  });

  // 게시글 2
  const article2 = await prisma.article.create({
    data: {
      title: "두 번째 게시글",
      content: "이것은 두 번째 게시글의 내용입니다.",
    },
  });

  // 게시글 3
  const article3 = await prisma.article.create({
    data: {
      title: "세 번째 게시글",
      content: "이것은 세 번째 게시글의 내용입니다.",
    },
  });

  const articleComment1 = await prisma.articleComment.create({
    data: {
      content: "이것은 첫 번째 게시글의 댓글 내용입니다.",
      articleId: article1.id,
    },
  });

  const articleComment2 = await prisma.articleComment.create({
    data: {
      content: "이것은 첫 번째 게시글의 댓글 내용입니다.",
      articleId: article1.id,
    },
  });

  const articleComment3 = await prisma.articleComment.create({
    data: {
      content: "이것은 두 번째 게시글의 댓글 내용입니다.",
      articleId: article2.id,
    },
  });

  const articleComment4 = await prisma.articleComment.create({
    data: {
      content: "이것은 세 번째 게시글의 댓글 내용입니다.",
      articleId: article3.id,
    },
  });

  const product1 = await prisma.product.create({
    data: {
      name: "첫 번째 상품",
      description: "첫 번째 상품 내용",
      price: 100000,
      tags: ["tag1", "test1"],
    },
  });
  const product2 = await prisma.product.create({
    data: {
      name: "두 번째 상품",
      description: "두 번째 상품 내용",
      price: 100000,
      tags: ["tag2", "test2"],
    },
  });
  const product3 = await prisma.product.create({
    data: {
      name: "세 번째 상품",
      description: "세 번째 상품 내용",
      price: 100000,
      tags: ["tag3", "test3"],
    },
  });

  const productComment1 = await prisma.productComment.create({
    data: {
      content: "이것은 첫 번째 상품 게시글의 댓글 내용입니다.",
      productId: product1.id,
    },
  });
  const productComment2 = await prisma.productComment.create({
    data: {
      content: "이것은 첫 번째 상품 게시글의 댓글 내용입니다.",
      productId: product1.id,
    },
  });
  const productComment3 = await prisma.productComment.create({
    data: {
      content: "이것은 두 번째 상품 게시글의 댓글 내용입니다.",
      productId: product2.id,
    },
  });
  const productComment4 = await prisma.productComment.create({
    data: {
      content: "이것은 세 번째 상품 게시글의 댓글 내용입니다.",
      productId: product3.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
