-- Add tier and accountInfo columns to requests table
ALTER TABLE requests 
ADD COLUMN IF NOT EXISTS tier VARCHAR(50) DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS "accountInfo" JSONB DEFAULT '{}';

-- Update existing rows to have default values
UPDATE requests SET tier = 'basic' WHERE tier IS NULL;
UPDATE requests SET "accountInfo" = '{}' WHERE "accountInfo" IS NULL;
