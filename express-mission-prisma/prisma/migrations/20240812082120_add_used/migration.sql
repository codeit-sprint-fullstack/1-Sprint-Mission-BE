-- AlterTable
ALTER TABLE "UsedCommend" ALTER COLUMN "usedMarketId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UsedMarket" ALTER COLUMN "userId" DROP NOT NULL;
