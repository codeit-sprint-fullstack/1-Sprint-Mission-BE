/*
  Warnings:

  - You are about to drop the column `favoriteCount` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `productImg` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "favoriteCount",
DROP COLUMN "productImg",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
