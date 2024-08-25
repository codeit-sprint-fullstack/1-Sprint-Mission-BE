/*
  Warnings:

  - Added the required column `productId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "productId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Comment_articleId_idx" ON "Comment"("articleId");

-- CreateIndex
CREATE INDEX "Comment_productId_idx" ON "Comment"("productId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
