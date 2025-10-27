import prisma from '../lib/prisma';
import { logger } from '../utils/logger';

async function addTierColumn() {
  try {
    logger.info('Adding tier column to requests table...');
    
    // Execute raw SQL to add tier column
    await prisma.$executeRaw`
      ALTER TABLE "requests" ADD COLUMN IF NOT EXISTS "tier" VARCHAR(20);
    `;
    
    logger.info('Tier column added successfully!');
    
    // Check the column exists
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'requests' AND column_name = 'tier';
    `;
    
    logger.info('Verification:', result);
    
  } catch (error) {
    logger.error('Failed to add tier column:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTierColumn();
