-- CreateTable
CREATE TABLE IF NOT EXISTS "bot_intents" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "patterns" JSONB NOT NULL,
  "responses" JSONB NOT NULL,
  "tags" JSONB,
  "requiresPayment" BOOLEAN DEFAULT false,
  "escalate" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "bot_intents_name_key" ON "bot_intents"("name");

-- Primary Key
ALTER TABLE "bot_intents"
  ADD CONSTRAINT IF NOT EXISTS "bot_intents_pkey" PRIMARY KEY ("id");
