/*
  Warnings:

  - Made the column `price` on table `FleaMarket` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FleaMarket" ALTER COLUMN "price" SET NOT NULL;
