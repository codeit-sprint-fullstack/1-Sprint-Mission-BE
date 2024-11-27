/*
  Warnings:

  - Made the column `user_id` on table `product_comment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "product_comment" DROP CONSTRAINT "product_comment_user_id_fkey";

-- AlterTable
ALTER TABLE "product_comment" ALTER COLUMN "user_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "product_comment" ADD CONSTRAINT "product_comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
