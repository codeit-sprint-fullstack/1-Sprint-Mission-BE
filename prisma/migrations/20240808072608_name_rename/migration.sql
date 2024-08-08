/*
  Warnings:

  - You are about to drop the column `createAT` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `createAT` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `createAT` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "createAT",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "createAT",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createAT",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
