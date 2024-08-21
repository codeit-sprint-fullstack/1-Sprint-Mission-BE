/*
  Warnings:

  - A unique constraint covering the columns `[id,boardType]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_boardType_key" ON "Comment"("id", "boardType");
