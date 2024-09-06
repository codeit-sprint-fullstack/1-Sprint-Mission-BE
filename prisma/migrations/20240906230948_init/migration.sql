/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `ArticleComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductComment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductFavoriteUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductTags` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserFavoriteProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProducts` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `user_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ArticleComment" DROP CONSTRAINT "ArticleComment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "ArticleComment" DROP CONSTRAINT "ArticleComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ProductComment" DROP CONSTRAINT "ProductComment_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductComment" DROP CONSTRAINT "ProductComment_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProductFavoriteUsers" DROP CONSTRAINT "ProductFavoriteUsers_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductFavoriteUsers" DROP CONSTRAINT "ProductFavoriteUsers_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProductImages" DROP CONSTRAINT "ProductImages_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductTags" DROP CONSTRAINT "ProductTags_productId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavoriteProducts" DROP CONSTRAINT "UserFavoriteProducts_productId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavoriteProducts" DROP CONSTRAINT "UserFavoriteProducts_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProducts" DROP CONSTRAINT "UserProducts_productId_fkey";

-- DropForeignKey
ALTER TABLE "UserProducts" DROP CONSTRAINT "UserProducts_userId_fkey";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "favorite" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "ownerId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "ArticleComment";

-- DropTable
DROP TABLE "ProductComment";

-- DropTable
DROP TABLE "ProductFavoriteUsers";

-- DropTable
DROP TABLE "ProductImages";

-- DropTable
DROP TABLE "ProductTags";

-- DropTable
DROP TABLE "UserFavoriteProducts";

-- DropTable
DROP TABLE "UserProducts";

-- CreateTable
CREATE TABLE "user_product" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorite_product" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "user_favorite_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_tags" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "product_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_favorite_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_favorite_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_favorite_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_favorite_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_comment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "content" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "article_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_comment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "content" VARCHAR(200) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_product" ADD CONSTRAINT "user_product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_product" ADD CONSTRAINT "user_product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_product" ADD CONSTRAINT "user_favorite_product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorite_product" ADD CONSTRAINT "user_favorite_product_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_favorite_user" ADD CONSTRAINT "product_favorite_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_favorite_user" ADD CONSTRAINT "product_favorite_user_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_favorite_user" ADD CONSTRAINT "article_favorite_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_favorite_user" ADD CONSTRAINT "article_favorite_user_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comment" ADD CONSTRAINT "article_comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_comment" ADD CONSTRAINT "article_comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_comment" ADD CONSTRAINT "product_comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_comment" ADD CONSTRAINT "product_comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
