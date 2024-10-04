/*
  Warnings:

  - You are about to drop the column `favoriteCount` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `isFavorite` on the `Article` table. All the data in the column will be lost.
  - Added the required column `image` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "favoriteCount",
DROP COLUMN "images",
DROP COLUMN "isFavorite",
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "isLike" BOOLEAN DEFAULT false,
ADD COLUMN     "likeCount" INTEGER DEFAULT 0;
