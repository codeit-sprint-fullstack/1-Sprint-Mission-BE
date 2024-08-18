/*
  Warnings:

  - Made the column `userId` on table `UsedCommend` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `UsedMarket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UsedCommend" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UsedMarket" ALTER COLUMN "userId" SET NOT NULL;
