-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
