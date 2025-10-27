-- AlterTable
-- Add tier column (nullable)
ALTER TABLE "requests" ADD COLUMN IF NOT EXISTS "tier" VARCHAR(20);
