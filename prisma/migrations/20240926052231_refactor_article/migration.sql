/*
  Warnings:

  - You are about to drop the column `articleId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_userId_fkey";

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_articleId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "articleId",
ADD COLUMN     "fleaMarketId" INTEGER,
ADD COLUMN     "freeBoardId" INTEGER;

-- DropTable
DROP TABLE "Article";

-- DropEnum
DROP TYPE "BoardType";

-- CreateTable
CREATE TABLE "FreeBoard" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "favorite" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT DEFAULT 'Anoymous',

    CONSTRAINT "FreeBoard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleaMarket" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "favorite" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "tags" TEXT[],
    "price" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT DEFAULT 'Anoymous',

    CONSTRAINT "FleaMarket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FreeBoard" ADD CONSTRAINT "FreeBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleaMarket" ADD CONSTRAINT "FleaMarket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_freeBoardId_fkey" FOREIGN KEY ("freeBoardId") REFERENCES "FreeBoard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_fleaMarketId_fkey" FOREIGN KEY ("fleaMarketId") REFERENCES "FleaMarket"("id") ON DELETE SET NULL ON UPDATE CASCADE;
