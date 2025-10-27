import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import paymentService from '../services/paymentService';
import intasendService from '../services/intasendService';
import emailService from '../services/emailService';

/**
 * Initiate payment with Flutterwave
 */
export const initiatePayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { requestId, amount, tier } = req.body;

  // Find the request with user
  const request = await prisma.request.findUnique({
    where: { id: requestId },
    include: { user: true }
  });
  
  if (!request) {
    throw new AppError('Request not found', 404);
  }

  // Check if payment already exists and is successful
  const existingPayment = await prisma.payment.findFirst({
    where: {
      requestId: request.id,
      status: { in: ['SUCCESSFUL', 'PAID'] }
    }
  });

  if (existingPayment) {
    throw new AppError('Payment already completed for this request', 400);
  }

  const user = request.user;

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      requestId: request.id,
      txRef: request.txRef,
      amount,
      currency: 'KES',
      status: 'PENDING'
    }
  });

  // Initiate payment with IntaSend (M-PESA, Airtel Money, Bank Transfer)
  const paymentPayload = {
    amount,
    currency: 'KES',
    email: user.email,
    phone_number: user.phone,
    name: user.name,
    api_ref: request.txRef, // Your unique transaction reference
    redirect_url: `${process.env.SUCCESS_URL}?tx_ref=${request.txRef}`
  };

  const intasendResponse = await intasendService.initiatePayment(paymentPayload);

  if (!intasendResponse.success) {
    throw new AppError(intasendResponse.error || 'Payment initiation failed', 500);
  }

  // Update payment with checkout ID
  await prisma.payment.update({
    where: { id: payment.id },
    data: { 
      flwRef: intasendResponse.checkoutId // Store IntaSend checkout ID
    }
  });

  logger.info(`IntaSend payment initiated for request ${requestId}: ${request.txRef}`);

  res.status(200).json({
    success: true,
    message: 'Payment initiated successfully',
    data: {
      paymentLink: intasendResponse.paymentUrl,
      checkoutId: intasendResponse.checkoutId,
      tx_ref: request.txRef,
      amount,
      currency: 'KES'
    }
  });
});

/**
 * Handle IntaSend webhook
 * CRITICAL: Always verify webhook and transaction
 */
export const handleWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  logger.info('IntaSend webhook received:', payload);

  // IntaSend webhook payload: { invoice_id, state, value, api_ref, ... }
  const { state, api_ref, value, invoice_id } = payload;

  // Only process completed transactions
  if (state === 'COMPLETE') {
    const tx_ref = api_ref; // Our transaction reference

    // CRITICAL: Verify transaction with IntaSend API
    try {
      const verification = await intasendService.verifyPayment(invoice_id);

      if (!verification.success || verification.status !== 'COMPLETE') {
        logger.warn(`IntaSend transaction verification failed: ${tx_ref}`);
        return res.status(200).json({ message: 'Transaction not successful' });
      }

      // Find request with user
      const request = await prisma.request.findUnique({
        where: { txRef: tx_ref },
        include: { user: true }
      });
      
      if (!request) {
        logger.error(`Request not found for tx_ref: ${tx_ref}`);
        return res.status(404).json({ error: 'Request not found' });
      }

      // Update payment record
      await prisma.payment.update({
        where: { txRef: tx_ref },
        data: {
          status: 'SUCCESSFUL',
          flwRef: invoice_id, // IntaSend invoice/checkout ID
          transactionId: invoice_id,
          gatewayResponse: payload
        }
      });

      // Update request payment status
      await prisma.request.update({
        where: { id: request.id },
        data: { paymentStatus: 'PAID' }
      });

      logger.info(`Payment successful: ${tx_ref} - Request ${request.id} updated`);

      // Send confirmation email
      const user = request.user;
      emailService.sendPaymentConfirmation(
        user.email,
        user.name,
        request.platform.toLowerCase(),
        value, // Amount from IntaSend
        tx_ref,
        request.id
      ).catch(err => logger.error('Email sending failed:', err));

      res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
      logger.error('Webhook processing error:', error);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  } else if (state === 'FAILED') {
    // Handle failed transactions
    const tx_ref = api_ref;
      
      await prisma.payment.updateMany({
        where: { txRef: tx_ref },
        data: { 
          status: 'FAILED',
          gatewayResponse: payload
        }
      });

      await prisma.request.updateMany({
        where: { txRef: tx_ref },
        data: { paymentStatus: 'FAILED' }
      });

      logger.info(`Payment failed: ${tx_ref}`);
      res.status(200).json({ message: 'Payment failed' });
  } else {
    // Other states (PENDING, PROCESSING, etc.)
    logger.info(`Payment status: ${state} for ${api_ref}`);
    res.status(200).json({ message: 'Webhook received' });
  }
});

/**
 * Verify payment status
 */
export const verifyPayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { tx_ref } = req.params;
  const { transaction_id } = req.query; // Get transaction ID from query params

  const payment = await prisma.payment.findUnique({
    where: { txRef: tx_ref },
    include: {
      request: {
        include: {
          user: true
        }
      }
    }
  });
  
  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  // If payment is still pending, verify with Flutterwave directly
  if (payment.status === 'PENDING') {
    try {
      // Use transaction_id from query params or the stored one
      const transactionIdToVerify = (transaction_id as string) || payment.transactionId;
      
      if (transactionIdToVerify) {
        logger.info(`Verifying payment with Flutterwave. TX Ref: ${tx_ref}, Transaction ID: ${transactionIdToVerify}`);
        const verification = await paymentService.verifyPayment(transactionIdToVerify);
        
        logger.info(`Flutterwave verification response:`, verification.data);
        
        if (verification.data.status === 'successful') {
          // Update payment to successful
          await prisma.payment.update({
            where: { txRef: tx_ref },
            data: {
              status: 'SUCCESSFUL',
              transactionId: transactionIdToVerify,
              flwRef: verification.data.flw_ref,
              gatewayResponse: verification.data
            }
          });
          
          // Update request payment status
          if (payment.request) {
            await prisma.request.update({
              where: { id: payment.request.id },
              data: { paymentStatus: 'PAID' }
            });
            
            // Send confirmation email
            emailService.sendPaymentConfirmation(
              payment.request.user.email,
              payment.request.user.name,
              payment.request.platform.toLowerCase(),
              payment.amount,
              tx_ref,
              payment.request.id
            ).catch(err => logger.error('Email sending failed:', err));
          }
          
          payment.status = 'SUCCESSFUL';
          logger.info(`Payment verified and updated: ${tx_ref}`);
        } else {
          logger.warn(`Payment verification returned status: ${verification.data.status} for ${tx_ref}`);
        }
      } else {
        logger.warn(`No transaction ID available for verification: ${tx_ref}`);
      }
    } catch (error) {
      logger.error('Flutterwave verification failed:', error);
    }
  }

  res.status(200).json({
    success: true,
    data: {
      tx_ref,
      paymentStatus: payment.status.toLowerCase(),
      requestStatus: payment.request?.status.toLowerCase(),
      amount: payment.amount,
      currency: payment.currency,
      request: payment.request ? {
        email: payment.request.user.email,
        phone: payment.request.user.phone,
        platform: payment.request.platform
      } : null
    }
  });
});

/**
 * Update pending payments - Admin only
 */
export const updatePendingPayments = asyncHandler(async (req: Request, res: Response) => {
  const pendingPayments = await prisma.payment.findMany({
    where: {
      status: 'PENDING',
      transactionId: { not: null }
    },
    include: {
      request: { include: { user: true } }
    }
  });

  let updatedCount = 0;

  for (const payment of pendingPayments) {
    try {
      if (!payment.transactionId) continue;

      const verification = await paymentService.verifyPayment(payment.transactionId);
      
      if (verification.data.status === 'successful') {
        await prisma.payment.update({
          where: { txRef: payment.txRef },
          data: {
            status: 'SUCCESSFUL',
            flwRef: verification.data.flw_ref
          }
        });

        if (payment.request) {
          await prisma.request.update({
            where: { id: payment.request.id },
            data: { paymentStatus: 'PAID' }
          });
        }

        updatedCount++;
        logger.info(`Updated payment: ${payment.txRef}`);
      }
    } catch (error) {
      logger.error(`Failed to update ${payment.txRef}:`, error);
    }
  }

  res.status(200).json({
    success: true,
    message: `Updated ${updatedCount} of ${pendingPayments.length} pending payments`
  });
});

/**
 * Fix all pending payments - Admin only
 */
export const fixPendingPayments = asyncHandler(async (req: Request, res: Response) => {
  try {
    logger.info('Finding all requests with PENDING payment status...');
    
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
        // If there's a payment record, mark as PAID
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

    res.status(200).json({
      success: true,
      message: `Successfully updated ${updatedCount} of ${pendingRequests.length} requests to PAID`
    });
  } catch (error: any) {
    logger.error('Fix pending payments failed:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fix pending payments',
      error: error.message
    });
  }
});

/**
 * Migrate tier column - Admin only
 */
export const migrateTierColumn = asyncHandler(async (req: Request, res: Response) => {
  try {
    logger.info('Running tier column migration...');
    
    // Add tier column if not exists
    await prisma.$executeRaw`
      ALTER TABLE "requests" ADD COLUMN IF NOT EXISTS "tier" VARCHAR(20);
    `;
    
    logger.info('Tier column migration completed successfully');
    
    res.status(200).json({
      success: true,
      message: 'Tier column added successfully'
    });
  } catch (error: any) {
    logger.error('Tier migration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

/**
 * Migrate platform enum - Admin only
 */
export const migratePlatformEnum = asyncHandler(async (req: Request, res: Response) => {
  try {
    logger.info('Running platform enum migration...');
    
    // Add new platform enum values
    await prisma.$executeRaw`ALTER TYPE "Platform" ADD VALUE IF NOT EXISTS 'SNAPCHAT'`;
    await prisma.$executeRaw`ALTER TYPE "Platform" ADD VALUE IF NOT EXISTS 'LINKEDIN'`;
    await prisma.$executeRaw`ALTER TYPE "Platform" ADD VALUE IF NOT EXISTS 'TELEGRAM'`;
    await prisma.$executeRaw`ALTER TYPE "Platform" ADD VALUE IF NOT EXISTS 'YAHOO'`;
    await prisma.$executeRaw`ALTER TYPE "Platform" ADD VALUE IF NOT EXISTS 'OUTLOOK'`;
    
    logger.info('Platform enum migration completed successfully');
    
    res.status(200).json({
      success: true,
      message: 'Platform enum values added successfully'
    });
  } catch (error: any) {
    logger.error('Platform enum migration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Migration failed',
      error: error.message
    });
  }
});

/**
 * Check if user has paid access for premium chat
 */
export const checkChatAccess = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.params; // email or phone

  // Find most recent successful payment for this user
  const payment = await prisma.payment.findFirst({
    where: {
      request: {
        user: {
          OR: [
            { email: identifier },
            { phone: identifier }
          ]
        }
      },
      status: { in: ['SUCCESSFUL', 'PAID'] }
    },
    include: {
      request: {
        include: {
          user: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const hasPaidAccess = !!payment;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Check if payment is within 30 days
  const isActive = payment ? payment.createdAt > thirtyDaysAgo : false;

  res.status(200).json({
    success: true,
    hasPaidAccess: hasPaidAccess && isActive,
    tier: payment?.request?.tier || null,
    platform: payment?.request?.platform || null,
    paymentDate: payment?.createdAt || null,
    expiresAt: payment ? new Date(payment.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000) : null,
    user: payment?.request?.user ? {
      name: payment.request.user.name,
      email: payment.request.user.email,
      phone: payment.request.user.phone
    } : null
  });
});
