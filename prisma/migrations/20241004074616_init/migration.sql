/*
  Warnings:

  - You are about to drop the column `productId` on the `product_comment` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `product_comment` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `product_images` table. All the data in the column will be lost.
  - You are about to alter the column `image` on the `product_images` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.
  - You are about to drop the column `productId` on the `product_tags` table. All the data in the column will be lost.
  - You are about to alter the column `tag` on the `product_tags` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `article_comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `article_favorite_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_favorite_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_favorite_product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_id` to the `product_comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `product_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `product_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `product_tags` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `product_tags` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_user_id_fkey";

-- DropForeignKey
ALTER TABLE "article_comment" DROP CONSTRAINT "article_comment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "article_comment" DROP CONSTRAINT "article_comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "article_favorite_user" DROP CONSTRAINT "article_favorite_user_articleId_fkey";

-- DropForeignKey
ALTER TABLE "article_favorite_user" DROP CONSTRAINT "article_favorite_user_userId_fkey";

-- DropForeignKey
ALTER TABLE "product_comment" DROP CONSTRAINT "product_comment_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_comment" DROP CONSTRAINT "product_comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "product_favorite_user" DROP CONSTRAINT "product_favorite_user_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_favorite_user" DROP CONSTRAINT "product_favorite_user_userId_fkey";

-- DropForeignKey
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_productId_fkey";

-- DropForeignKey
ALTER TABLE "product_tags" DROP CONSTRAINT "product_tags_productId_fkey";

-- DropForeignKey
ALTER TABLE "user_favorite_product" DROP CONSTRAINT "user_favorite_product_productId_fkey";

-- DropForeignKey
ALTER TABLE "user_favorite_product" DROP CONSTRAINT "user_favorite_product_user_id_fkey";

-- DropForeignKey
ALTER TABLE "user_product" DROP CONSTRAINT "user_product_product_id_fkey";

-- DropForeignKey
ALTER TABLE "user_product" DROP CONSTRAINT "user_product_user_id_fkey";

-- AlterTable
ALTER TABLE "product_comment" DROP COLUMN "productId",
DROP COLUMN "userId",
ADD COLUMN     "product_id" TEXT NOT NULL,
ALTER COLUMN "content" SET DATA TYPE VARCHAR(500);

-- AlterTable
ALTER TABLE "product_images" DROP COLUMN "productId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "image" SET DATA TYPE VARCHAR(2048);

-- AlterTable
ALTER TABLE "product_tags" DROP COLUMN "productId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "tag" SET DATA TYPE VARCHAR(50);

-- DropTable
DROP TABLE "Article";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "article_comment";

-- DropTable
DROP TABLE "article_favorite_user";

-- DropTable
DROP TABLE "product_favorite_user";

-- DropTable
DROP TABLE "user_favorite_product";

-- DropTable
DROP TABLE "user_product";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(60) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "nickname" VARCHAR(50) NOT NULL,
    "image" VARCHAR(2048) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(1024) NOT NULL,
    "price" INTEGER NOT NULL,
    "favorite_count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite_product" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favorite_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "content" VARCHAR(1024) NOT NULL,
    "favorite_count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_images" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "image" VARCHAR(2048) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_favorite" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_comment" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "content" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "post_comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_nickname_key" ON "user"("nickname");

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_product" ADD CONSTRAINT "favorite_product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_product" ADD CONSTRAINT "favorite_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_comment" ADD CONSTRAINT "product_comment_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_images" ADD CONSTRAINT "post_images_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_favorite" ADD CONSTRAINT "post_favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_favorite" ADD CONSTRAINT "post_favorite_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comment" ADD CONSTRAINT "post_comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
