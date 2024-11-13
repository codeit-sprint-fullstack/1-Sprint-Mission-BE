/*
  Warnings:

  - You are about to drop the `post_favorite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "post_favorite" DROP CONSTRAINT "post_favorite_post_id_fkey";

-- DropForeignKey
ALTER TABLE "post_favorite" DROP CONSTRAINT "post_favorite_user_id_fkey";

-- AlterTable
ALTER TABLE "product_comment" ADD COLUMN     "userId" TEXT;

-- DropTable
DROP TABLE "post_favorite";

-- CreateTable
CREATE TABLE "favorite_post" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favorite_post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorite_post_user_id_post_id_key" ON "favorite_post"("user_id", "post_id");

-- AddForeignKey
ALTER TABLE "product_comment" ADD CONSTRAINT "product_comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_post" ADD CONSTRAINT "favorite_post_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_post" ADD CONSTRAINT "favorite_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
