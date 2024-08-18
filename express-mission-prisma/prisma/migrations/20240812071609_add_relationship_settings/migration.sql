-- AlterTable
ALTER TABLE "FreeCommend" ADD COLUMN     "noticeBoardId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "NoticeBoard" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "UsedCommend" ADD COLUMN     "usedMarketId" TEXT,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "UsedMarket" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "NoticeBoard" ADD CONSTRAINT "NoticeBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeCommend" ADD CONSTRAINT "FreeCommend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FreeCommend" ADD CONSTRAINT "FreeCommend_noticeBoardId_fkey" FOREIGN KEY ("noticeBoardId") REFERENCES "NoticeBoard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedCommend" ADD CONSTRAINT "UsedCommend_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedCommend" ADD CONSTRAINT "UsedCommend_usedMarketId_fkey" FOREIGN KEY ("usedMarketId") REFERENCES "UsedMarket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsedMarket" ADD CONSTRAINT "UsedMarket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
