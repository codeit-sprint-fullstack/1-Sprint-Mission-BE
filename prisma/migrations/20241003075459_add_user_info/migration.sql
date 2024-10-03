/*
  Warnings:

  - A unique constraint covering the columns `[userId,freeBoardId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,fleaMarketId]` on the table `Favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "encryptedPassword" TEXT,
ADD COLUMN     "image" TEXT[],
ADD COLUMN     "nickname" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_freeBoardId_key" ON "Favorite"("userId", "freeBoardId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_fleaMarketId_key" ON "Favorite"("userId", "fleaMarketId");
