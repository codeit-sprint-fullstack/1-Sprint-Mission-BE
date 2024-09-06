/*
  Warnings:

  - The values [MarketplaceComment,FreeboardComment] on the enum `BoardType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BoardType_new" AS ENUM ('fleamarket', 'freeboard');
ALTER TABLE "Article" ALTER COLUMN "category" TYPE "BoardType_new" USING ("category"::text::"BoardType_new");
ALTER TYPE "BoardType" RENAME TO "BoardType_old";
ALTER TYPE "BoardType_new" RENAME TO "BoardType";
DROP TYPE "BoardType_old";
COMMIT;
