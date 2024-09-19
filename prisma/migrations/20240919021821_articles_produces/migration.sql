-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "favorite" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "images" TEXT,
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "tags" TEXT[];
