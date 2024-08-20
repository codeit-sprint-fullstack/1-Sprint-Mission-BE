/*
  Warnings:

  - You are about to drop the column `UserId` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `ArticleId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `ProductId` on the `ProductFavoriteUsers` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `ProductFavoriteUsers` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `UserFavoriteProducts` table. All the data in the column will be lost.
  - You are about to drop the column `ProductId` on the `UserProducts` table. All the data in the column will be lost.
  - You are about to drop the column `UserId` on the `UserProducts` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `articleId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ProductFavoriteUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ProductFavoriteUsers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `UserFavoriteProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserFavoriteProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `UserProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `UserProducts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "UserId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "ArticleId",
DROP COLUMN "UserId",
ADD COLUMN     "articleId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "ownerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ProductFavoriteUsers" DROP COLUMN "ProductId",
DROP COLUMN "UserId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductImages" ALTER COLUMN "productId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ProductTags" ALTER COLUMN "productId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserFavoriteProducts" DROP COLUMN "UserId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "ProductId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "UserProducts" DROP COLUMN "ProductId",
DROP COLUMN "UserId",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "UserProducts" ADD CONSTRAINT "UserProducts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProducts" ADD CONSTRAINT "UserProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteProducts" ADD CONSTRAINT "UserFavoriteProducts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteProducts" ADD CONSTRAINT "UserFavoriteProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTags" ADD CONSTRAINT "ProductTags_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductImages" ADD CONSTRAINT "ProductImages_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFavoriteUsers" ADD CONSTRAINT "ProductFavoriteUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFavoriteUsers" ADD CONSTRAINT "ProductFavoriteUsers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
