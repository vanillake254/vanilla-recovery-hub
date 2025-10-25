import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import paymentService from '../services/paymentService';
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

  // Initiate payment with Flutterwave
  const paymentPayload = {
    tx_ref: request.txRef,
    amount,
    currency: 'KES',
    redirect_url: `${process.env.SUCCESS_URL}?tx_ref=${request.txRef}`,
    customer: {
      email: user.email,
      name: user.name,
      phonenumber: user.phone
    },
    customizations: {
      title: 'Vanilla Recovery Hub',
      description: `Account Recovery - ${request.platform.toLowerCase()}`,
      logo: 'https://your-logo-url.com/logo.png'
    },
    payment_options: 'card,mobilemoney,ussd',
    meta: {
      requestId: request.id,
      platform: request.platform.toLowerCase(),
      tier: tier || 'basic'
    }
  };

  const flutterwaveResponse = await paymentService.initiatePayment(paymentPayload);

  logger.info(`Payment initiated for request ${requestId}: ${request.tx_ref}`);

  res.status(200).json({
    success: true,
    message: 'Payment initiated successfully',
    data: {
      paymentLink: flutterwaveResponse.data.link,
      tx_ref: request.txRef,
      amount,
      currency: 'KES'
    }
  });
});

/**
 * Handle Flutterwave webhook
 * CRITICAL: Always verify webhook signature and transaction
 */
export const handleWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const signature = req.headers['verif-hash'] as string;

  // Verify webhook signature
  if (!signature || signature !== process.env.FLW_SECRET_KEY) {
    logger.warn('Invalid webhook signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const payload = req.body;
  logger.info('Webhook received:', { event: payload.event, tx_ref: payload.data?.tx_ref });

  // Only process successful transactions
  if (payload.event === 'charge.completed' && payload.data.status === 'successful') {
    const { tx_ref, amount, currency, id: transactionId, flw_ref } = payload.data;

    // CRITICAL: Verify transaction with Flutterwave API
    try {
      const verification = await paymentService.verifyPayment(transactionId);

      if (verification.data.status !== 'successful') {
        logger.warn(`Transaction verification failed: ${tx_ref}`);
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
          flwRef: flw_ref,
          transactionId: transactionId,
          gatewayResponse: payload.data
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
        amount,
        tx_ref,
        request.id
      ).catch(err => logger.error('Email sending failed:', err));

      res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
      logger.error('Webhook processing error:', error);
      return res.status(500).json({ error: 'Webhook processing failed' });
    }
  } else {
    // Handle failed or other events
    if (payload.event === 'charge.completed' && payload.data.status === 'failed') {
      const { tx_ref } = payload.data;
      
      await prisma.payment.updateMany({
        where: { txRef: tx_ref },
        data: { 
          status: 'FAILED',
          gatewayResponse: payload.data
        }
      });

      await prisma.request.updateMany({
        where: { txRef: tx_ref },
        data: { paymentStatus: 'FAILED' }
      });

      logger.info(`Payment failed: ${tx_ref}`);
    }

    res.status(200).json({ message: 'Webhook received' });
  }
});

/**
 * Verify payment status
 */
export const verifyPayment = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { tx_ref } = req.params;

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
 * Check if user has paid access for premium chat
 */
export const checkChatAccess = asyncHandler(async (req: Request, res: Response) => {
  const { identifier } = req.params; // email or phone

  // Find most recent successful payment for this user
  const payment = await prisma.payment.findFirst({
    where: {
      request: {
        OR: [
          { email: identifier },
          { phone: identifier }
        ]
      },
      status: { in: ['SUCCESSFUL', 'PAID'] }
    },
    include: {
      request: true
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
    expiresAt: payment ? new Date(payment.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000) : null
  });
});
