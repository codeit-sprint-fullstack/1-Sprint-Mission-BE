-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "CommentMarketPostRelation" FOREIGN KEY ("postId") REFERENCES "MarketPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
