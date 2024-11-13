/*
  Warnings:

  - Made the column `count` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "count" SET NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "image" SET NOT NULL;
