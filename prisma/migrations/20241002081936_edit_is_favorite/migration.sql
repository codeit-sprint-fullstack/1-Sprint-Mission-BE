/*
  Warnings:

  - You are about to drop the column `isFavorited` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `isFavorited` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "isFavorited",
ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isFavorited",
ADD COLUMN     "isFavorite" BOOLEAN DEFAULT false;
