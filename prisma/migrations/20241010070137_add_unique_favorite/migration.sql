/*
  Warnings:

  - A unique constraint covering the columns `[user_id,product_id]` on the table `favorite_product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,post_id]` on the table `post_favorite` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "favorite_product_user_id_product_id_key" ON "favorite_product"("user_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "post_favorite_user_id_post_id_key" ON "post_favorite"("user_id", "post_id");
