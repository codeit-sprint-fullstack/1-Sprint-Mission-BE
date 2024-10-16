/*
  Warnings:

  - You are about to drop the column `userId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `_ProductLike` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `writerId` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ProductLike" DROP CONSTRAINT "_ProductLike_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductLike" DROP CONSTRAINT "_ProductLike_B_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "userId",
ADD COLUMN     "writerId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_ProductLike";

-- CreateTable
CREATE TABLE "_ProductFavorite" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductFavorite_AB_unique" ON "_ProductFavorite"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductFavorite_B_index" ON "_ProductFavorite"("B");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductFavorite" ADD CONSTRAINT "_ProductFavorite_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductFavorite" ADD CONSTRAINT "_ProductFavorite_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
