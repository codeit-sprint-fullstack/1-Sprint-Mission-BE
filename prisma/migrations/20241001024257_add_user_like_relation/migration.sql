/*
  Warnings:

  - Added the required column `userId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
