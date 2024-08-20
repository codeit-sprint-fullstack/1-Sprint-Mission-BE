const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const seed = async () => {
  const product = await prisma.product.create({
    data: {
      name: '아이폰 16 프로',
      description: '아이폰 16 프로입니다.',
      price: 1000,
      tags: ['애플', '신제품']
    }
  });

  const article = await prisma.article.create({
    data: {
      title: '아이폰 16 프로 출시 한 달 전',
      content: '아이폰 16 프로가 출시 한 달 전이라고 합니다.'
    }
  });

  await prisma.comment.createMany({
    data: [
      { content: '너무 기대됩니다.', productId: product.id },
      { content: '사양은 어느 정도일까요?', articleId: article.id }
    ]
  });

  console.log('Seeding completed');
  await prisma.$disconnect();
};

seed();

