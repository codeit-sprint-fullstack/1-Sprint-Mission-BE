import mongoose from "mongoose";
import Product from "./products.js";
import Comment from "./productsComment.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Database connected");
});

async function seedMain() {
  await Product.deleteMany({});
  await Comment.deleteMany({});

  const product1 = await Product.create({
    name: "product1",
    description: "최소 10글자 테스트 입니다.",
    price: 100,
    tag: ["tag1", "tag2"],
  });
  const product2 = await Product.create({
    name: "product2",
    description: "최소 10글자 테스트 입니다.",
    price: 200,
    tag: ["tag1", "tag2"],
  });
  const product3 = await Product.create({
    name: "product3",
    description: "최소 10글자 테스트 입니다.",
    price: 300,
    tag: ["tag1", "tag2"],
  });

  const comment1 = await Comment.create({
    content: "comment1",
    productId: product1.id,
  });
  const comment2 = await Comment.create({
    content: "comment2",
    productId: product1.id,
  });
  const comment3 = await Comment.create({
    content: "comment3",
    productId: product2.id,
  });
  const comment4 = await Comment.create({
    content: "comment4",
    productId: product3.id,
  });

  await Product.findByIdAndUpdate(product1.id, {
    $push: {
      comment: comment1.id,
    },
  });

  await Product.findByIdAndUpdate(product2.id, {
    $push: {
      comment: comment2.id,
    },
  });
  await Product.findByIdAndUpdate(product3.id, {
    $push: {
      comment: comment3.id,
    },
  });
  await Product.findByIdAndUpdate(product3.id, {
    $push: {
      comment: comment4.id,
    },
  });
}

seedMain()
  .then(async () => {
    await mongoose.connection.close();
    console.log("Database seeded");
  })
  .catch(async (e) => {
    console.error(e);
    await mongoose.connection.close();
    process.exit(1);
  });
