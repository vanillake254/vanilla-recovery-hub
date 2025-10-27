import prisma from '../lib/prisma';
import { logger } from '../utils/logger';

async function ensureTierColumn() {
  try {
    logger.info('Checking if tier column exists...');
    
    // Check if tier column exists
    const columnCheck = await prisma.$queryRaw<any[]>`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'requests' AND column_name = 'tier';
    `;

    if (columnCheck.length === 0) {
      logger.info('Tier column not found, adding it...');
      
      // Add tier column if it doesn't exist
      await prisma.$executeRaw`
        ALTER TABLE "requests" ADD COLUMN IF NOT EXISTS "tier" VARCHAR(20);
      `;
      
      // Set default value for existing records
      await prisma.$executeRaw`
        UPDATE "requests" SET "tier" = 'basic' WHERE "tier" IS NULL;
      `;
      
      logger.info('Tier column added successfully!');
    } else {
      logger.info('Tier column already exists.');
    }
    
    // Verify all requests have a tier value
    const requestsWithoutTier = await prisma.$queryRaw<any[]>`
      SELECT COUNT(*) as count FROM "requests" WHERE "tier" IS NULL;
    `;
    
    if (requestsWithoutTier[0]?.count > 0) {
      logger.info(`Found ${requestsWithoutTier[0].count} requests without tier, updating...`);
      await prisma.$executeRaw`
        UPDATE "requests" SET "tier" = 'basic' WHERE "tier" IS NULL;
      `;
    }
    
    logger.info('Database schema verification complete!');
    
  } catch (error) {
    logger.error('Failed to ensure tier column:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run on startup
ensureTierColumn();

export default ensureTierColumn;
