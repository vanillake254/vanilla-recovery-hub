import prisma from '../lib/prisma';
import paymentService from '../services/paymentService';
import { logger } from '../utils/logger';

async function updatePendingPayments() {
  try {
    const pendingPayments = await prisma.payment.findMany({
      where: {
        status: 'PENDING',
        transactionId: { not: null }
      },
      include: {
        request: {
          include: { user: true }
        }
      }
    });

    logger.info(`Found ${pendingPayments.length} pending payments`);

    for (const payment of pendingPayments) {
      try {
        if (!payment.transactionId) continue;

        const verification = await paymentService.verifyPayment(payment.transactionId);
        
        if (verification.data.status === 'successful') {
          await prisma.payment.update({
            where: { txRef: payment.txRef },
            data: {
              status: 'SUCCESSFUL',
              flwRef: verification.data.flw_ref,
              gatewayResponse: verification.data
            }
          });

          if (payment.request) {
            await prisma.request.update({
              where: { id: payment.request.id },
              data: { paymentStatus: 'PAID' }
            });
          }

          logger.info(`Updated payment: ${payment.txRef}`);
        }
      } catch (error) {
        logger.error(`Failed to update ${payment.txRef}:`, error);
      }
    }

    logger.info('Payment update complete');
  } catch (error) {
    logger.error('Update failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePendingPayments();
