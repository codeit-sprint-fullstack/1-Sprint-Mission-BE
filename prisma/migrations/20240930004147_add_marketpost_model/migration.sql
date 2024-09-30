-- CreateTable
CREATE TABLE "MarketPost" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "tags" TEXT[],
    "images" TEXT[],
    "ownerId" INTEGER NOT NULL,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerNickname" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MarketPost_pkey" PRIMARY KEY ("id")
);
