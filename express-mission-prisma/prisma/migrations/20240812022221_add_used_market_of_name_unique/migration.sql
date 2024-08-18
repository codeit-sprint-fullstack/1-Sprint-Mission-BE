/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `UsedMarket` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UsedMarket_name_key" ON "UsedMarket"("name");
