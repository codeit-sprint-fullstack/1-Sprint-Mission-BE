/*
  Warnings:

  - Made the column `noticeBoardId` on table `FreeCommend` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `FreeCommend` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `NoticeBoard` required. This step will fail if there are existing NULL values in that column.
  - Made the column `usedMarketId` on table `UsedCommend` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `UsedCommend` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `UsedMarket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FreeCommend" ALTER COLUMN "noticeBoardId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "NoticeBoard" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UsedCommend" ALTER COLUMN "usedMarketId" SET NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "UsedMarket" ALTER COLUMN "userId" SET NOT NULL;
