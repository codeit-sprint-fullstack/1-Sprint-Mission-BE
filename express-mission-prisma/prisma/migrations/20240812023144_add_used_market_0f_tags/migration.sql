/*
  Warnings:

  - You are about to drop the column `tag` on the `UsedMarket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsedMarket" DROP COLUMN "tag",
ADD COLUMN     "tags" TEXT[];
