import express from 'express';
import { body } from 'express-validator';
import * as adminController from '../controllers/adminController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

/**
 * @route   POST /api/admin/login
 * @desc    Admin login (for testing - in production, use Firebase Auth)
 * @access  Public
 */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  adminController.adminLogin
);

// All admin routes below require authentication
router.use(authenticateToken, requireAdmin);

/**
 * @route   GET /api/admin/requests
 * @desc    Get all recovery requests (paginated)
 * @access  Admin
 */
router.get('/requests', adminController.getAllRequests);

/**
 * @route   GET /api/admin/requests/:id
 * @desc    Get single request details
 * @access  Admin
 */
router.get('/requests/:id', adminController.getRequestDetails);

/**
 * @route   POST /api/admin/requests/:id/comment
 * @desc    Add comment/note to request
 * @access  Admin
 */
router.post(
  '/requests/:id/comment',
  [
    body('text').trim().notEmpty().withMessage('Comment text is required')
  ],
  adminController.addComment
);

/**
 * @route   PUT /api/admin/requests/:id/status
 * @desc    Update request status
 * @access  Admin
 */
router.put(
  '/requests/:id/status',
  [
    body('status').isIn(['new', 'in_progress', 'resolved', 'failed']).withMessage('Invalid status')
  ],
  adminController.updateStatus
);

/**
 * @route   GET /api/admin/chat/sessions
 * @desc    Get active/escalated chat sessions
 * @access  Admin
 */
router.get('/chat/sessions', adminController.getChatSessions);

/**
 * @route   POST /api/admin/chat/reply
 * @desc    Admin reply to chat session
 * @access  Admin
 */
router.post(
  '/chat/reply',
  [
    body('sessionId').notEmpty().withMessage('Session ID is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  adminController.replyToChat
);

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Admin
 */
router.get('/dashboard/stats', adminController.getDashboardStats);

/**
 * @route   GET /api/admin/bot/training
 * @desc    Get all bot training data
 * @access  Admin
 */
router.get('/bot/training', adminController.getBotTraining);

/**
 * @route   POST /api/admin/bot/training
 * @desc    Add new bot training intent
 * @access  Admin
 */
router.post(
  '/bot/training',
  [
    body('patterns').isArray().withMessage('Patterns must be an array'),
    body('responses').isArray().withMessage('Responses must be an array'),
    body('name').optional().isString()
  ],
  adminController.addBotTraining
);

/**
 * @route   DELETE /api/admin/bot/training/:intentName
 * @desc    Delete bot training intent
 * @access  Admin
 */
router.delete('/bot/training/:intentName', adminController.deleteBotTraining);

export default router;
