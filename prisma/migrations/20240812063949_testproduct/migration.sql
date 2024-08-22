/*
  Warnings:

  - You are about to drop the column `centent` on the `ProductCommnet` table. All the data in the column will be lost.
  - Added the required column `content` to the `ProductCommnet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductCommnet" DROP COLUMN "centent",
ADD COLUMN     "content" TEXT NOT NULL;
