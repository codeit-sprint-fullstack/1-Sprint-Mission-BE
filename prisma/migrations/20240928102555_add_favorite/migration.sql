-- CreateTable
CREATE TABLE "Favorite" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT DEFAULT 'Anoymous',
    "freeBoardId" INTEGER,
    "fleaMarketId" INTEGER,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_freeBoardId_fkey" FOREIGN KEY ("freeBoardId") REFERENCES "FreeBoard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_fleaMarketId_fkey" FOREIGN KEY ("fleaMarketId") REFERENCES "FleaMarket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
