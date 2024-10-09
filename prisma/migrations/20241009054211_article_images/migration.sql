/*
  Warnings:

  - You are about to drop the column `image` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
