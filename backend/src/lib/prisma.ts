/**
 * Prisma Client Instance
 * Singleton pattern to prevent multiple instances in development
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Extend PrismaClient for custom logging
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: any) => {
    logger.debug('Prisma Query', {
      query: e.query,
      duration: `${e.duration}ms`,
    });
  });
}

// Log errors
prisma.$on('error', (e: any) => {
  logger.error('Prisma Error', { error: e });
});

// Log warnings
prisma.$on('warn', (e: any) => {
  logger.warn('Prisma Warning', { warning: e });
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;

/**
 * Connect to database
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅ PostgreSQL connected successfully');
  } catch (error) {
    logger.error('❌ PostgreSQL connection error:', error);
    process.exit(1);
  }
};

/**
 * Disconnect from database
 */
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('PostgreSQL disconnected');
  } catch (error) {
    logger.error('Error disconnecting from PostgreSQL:', error);
  }
};

/**
 * Health check for database
 */
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};
