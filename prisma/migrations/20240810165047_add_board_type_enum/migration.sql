-- CreateEnum
CREATE TYPE "boardType" AS ENUM ('board', 'market');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "boardType" "boardType" NOT NULL DEFAULT 'board';
