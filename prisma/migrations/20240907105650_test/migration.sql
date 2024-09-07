/*
  Warnings:

  - You are about to drop the column `count` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "count",
ADD COLUMN     "counts" INTEGER DEFAULT 0;
