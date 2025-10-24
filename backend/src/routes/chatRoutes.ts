import express from 'express';
import { body } from 'express-validator';
import * as chatController from '../controllers/chatController';
import { chatRateLimiter } from '../middleware/rateLimiter';

const router = express.Router();

/**
 * @route   POST /api/chat/send
 * @desc    Send message to chatbot
 * @access  Public
 */
router.post(
  '/send',
  chatRateLimiter,
  [
    body('sessionId').notEmpty().withMessage('Session ID is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
    body('context').optional().isObject()
  ],
  chatController.sendMessage
);

/**
 * @route   GET /api/chat/session/:sessionId
 * @desc    Get chat session history
 * @access  Public
 */
router.get('/session/:sessionId', chatController.getSession);

export default router;
