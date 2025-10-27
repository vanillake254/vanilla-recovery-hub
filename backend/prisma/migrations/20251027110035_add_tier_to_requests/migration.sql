-- AlterTable
-- Add tier column with default value
ALTER TABLE "requests" ADD COLUMN IF NOT EXISTS "tier" VARCHAR(20) DEFAULT 'basic';

-- Update existing records to have 'basic' tier
UPDATE "requests" SET "tier" = 'basic' WHERE "tier" IS NULL;

-- Make tier NOT NULL after updating existing records
ALTER TABLE "requests" ALTER COLUMN "tier" SET NOT NULL;
