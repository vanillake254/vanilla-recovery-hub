import express from 'express';
import { body } from 'express-validator';
import * as requestController from '../controllers/requestController';

const router = express.Router();

/**
 * @route   POST /api/requests/create
 * @desc    Create a new recovery request
 * @access  Public
 */
router.post(
  '/create',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('platform').custom((value) => {
      const validPlatforms = ['facebook', 'instagram', 'gmail', 'tiktok', 'youtube', 'twitter', 'whatsapp', 'other', 
                             'FACEBOOK', 'INSTAGRAM', 'GMAIL', 'TIKTOK', 'YOUTUBE', 'TWITTER', 'WHATSAPP', 'OTHER',
                             'snapchat', 'linkedin', 'telegram', 'yahoo', 'outlook',
                             'SNAPCHAT', 'LINKEDIN', 'TELEGRAM', 'YAHOO', 'OUTLOOK'];
      return validPlatforms.includes(value);
    }).withMessage('Invalid platform'),
    body('description').optional().trim(),
    body('hasEmailAccess').optional().isBoolean(),
    body('tier').optional().isIn(['basic', 'premium']).withMessage('Invalid tier')
  ],
  requestController.createRequest
);

/**
 * @route   GET /api/requests/:id
 * @desc    Get request details by ID
 * @access  Public
 */
router.get('/:id', requestController.getRequest);

/**
 * @route   GET /api/requests/track/:txRef
 * @desc    Track request by transaction reference
 * @access  Public
 */
router.get('/track/:txRef', requestController.trackRequest);

/**
 * @route   GET /api/requests/user/:identifier
 * @desc    Get all requests for a user by email or phone
 * @access  Public
 */
router.get('/user/:identifier', requestController.getUserRequests);

/**
 * @route   POST /api/requests/:id/message
 * @desc    Customer sends message about their request
 * @access  Public
 */
router.post(
  '/:id/message',
  [
    body('text').trim().notEmpty().withMessage('Message text is required')
  ],
  requestController.addCustomerMessage
);

export default router;
