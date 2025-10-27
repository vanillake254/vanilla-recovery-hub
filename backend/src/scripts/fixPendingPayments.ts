import prisma from '../lib/prisma';
import { logger } from '../utils/logger';

async function fixPendingPayments() {
  try {
    logger.info('Finding all requests with PENDING payment status...');
    
    // Find all requests with PENDING status
    const pendingRequests = await prisma.request.findMany({
      where: {
        paymentStatus: 'PENDING'
      },
      include: {
        payment: true
      }
    });

    logger.info(`Found ${pendingRequests.length} requests with PENDING status`);

    let updatedCount = 0;

    for (const request of pendingRequests) {
      try {
        // If there's a payment record at all, mark as PAID
        // (since they wouldn't have a request without initiating payment)
        if (request.payment) {
          await prisma.request.update({
            where: { id: request.id },
            data: { paymentStatus: 'PAID' }
          });

          // Also update payment status if it's PENDING
          if (request.payment.status === 'PENDING') {
            await prisma.payment.update({
              where: { id: request.payment.id },
              data: { status: 'SUCCESSFUL' }
            });
          }

          updatedCount++;
          logger.info(`Updated request ${request.txRef} to PAID`);
        }
      } catch (error) {
        logger.error(`Failed to update ${request.txRef}:`, error);
      }
    }

    logger.info(`Successfully updated ${updatedCount} of ${pendingRequests.length} requests`);
    
  } catch (error) {
    logger.error('Fix pending payments failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPendingPayments();
