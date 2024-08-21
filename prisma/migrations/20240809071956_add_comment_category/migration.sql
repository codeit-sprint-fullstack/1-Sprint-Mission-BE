/*
  Warnings:

  - Added the required column `category` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('MARKET', 'BOARD');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "category" "Category" NOT NULL;
