/*
  Warnings:

  - You are about to drop the column `counts` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "counts",
ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 0;
