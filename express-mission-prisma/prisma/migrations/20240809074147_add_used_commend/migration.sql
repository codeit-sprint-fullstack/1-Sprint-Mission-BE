/*
  Warnings:

  - You are about to drop the `Commend` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Commend";

-- CreateTable
CREATE TABLE "FreeCommend" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FreeCommend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsedCommend" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsedCommend_pkey" PRIMARY KEY ("id")
);
