-- First, add the column with NULL allowed
ALTER TABLE "Comment" ADD COLUMN "author" TEXT;

-- After adding the column, you might want to set a default value for existing records
UPDATE "Comment" SET "author" = 'unknown' WHERE "author" IS NULL;

-- Finally, set the column to NOT NULL with a default value
ALTER TABLE "Comment" ALTER COLUMN "author" SET DEFAULT 'unknown';
ALTER TABLE "Comment" ALTER COLUMN "author" SET NOT NULL;
