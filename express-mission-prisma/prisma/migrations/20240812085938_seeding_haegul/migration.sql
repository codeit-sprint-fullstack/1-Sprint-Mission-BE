/*
  Warnings:

  - Made the column `usedMarketId` on table `UsedCommend` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UsedCommend" ALTER COLUMN "usedMarketId" SET NOT NULL;
