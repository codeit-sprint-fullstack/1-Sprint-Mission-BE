/*
  Warnings:

  - You are about to drop the column `favorite` on the `FleaMarket` table. All the data in the column will be lost.
  - You are about to drop the column `favorite` on the `FreeBoard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FleaMarket" DROP COLUMN "favorite";

-- AlterTable
ALTER TABLE "FreeBoard" DROP COLUMN "favorite";
