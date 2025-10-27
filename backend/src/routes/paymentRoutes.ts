import express from 'express';
import { body } from 'express-validator';
import * as paymentController from '../controllers/paymentController';
import { paymentRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

/**
 * @route   POST /api/payments/initiate
 * @desc    Initiate payment with Flutterwave
 * @access  Public
 */
router.post(
  '/initiate',
  paymentRateLimiter,
  [
    body('requestId').notEmpty().withMessage('Request ID is required'),
    body('amount').isNumeric().withMessage('Amount must be numeric'),
    body('tier').optional().isIn(['basic', 'premium']).withMessage('Invalid tier')
  ],
  paymentController.initiatePayment
);

/**
 * @route   POST /api/payments/webhook
 * @desc    Handle Flutterwave webhook
 * @access  Public (but verified)
 */
router.post('/webhook', paymentController.handleWebhook);

/**
 * @route   GET /api/payments/verify/:tx_ref
 * @desc    Verify payment status
 * @access  Public
 */
router.get('/verify/:tx_ref', paymentController.verifyPayment);

/**
 * @route   GET /api/payments/check-access/:identifier
 * @desc    Check if user has paid access by email or phone
 * @access  Public
 */
router.get('/check-access/:identifier', paymentController.checkChatAccess);

/**
 * @route   POST /api/payments/update-pending
 * @desc    Update pending payments by verifying with Flutterwave
 * @access  Admin
 */
router.post('/update-pending', paymentController.updatePendingPayments);

/**
 * @route   POST /api/payments/migrate-tier
 * @desc    Add tier column to requests table
 * @access  Admin
 */
router.post('/migrate-tier', paymentController.migrateTierColumn);

/**
 * @route   POST /api/payments/fix-pending
 * @desc    Fix all pending payments to PAID status
 * @access  Admin
 */
router.post('/fix-pending', paymentController.fixPendingPayments);

/**
 * @route   POST /api/payments/migrate-platform
 * @desc    Add new platform enum values
 * @access  Admin
 */
router.post('/migrate-platform', paymentController.migratePlatformEnum);

export default router;
