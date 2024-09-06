-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "userName" TEXT DEFAULT 'Anoymous';

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("name") ON DELETE SET NULL ON UPDATE CASCADE;
