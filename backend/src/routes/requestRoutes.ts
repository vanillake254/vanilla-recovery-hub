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
    body('phone').matches(/^(\+254|254|0)[17]\d{8}$/).withMessage('Valid Kenyan phone number required'),
    body('platform').isIn(['facebook', 'instagram', 'gmail', 'tiktok', 'youtube', 'twitter', 'whatsapp', 'other'])
      .withMessage('Invalid platform'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('hasEmailAccess').optional().isBoolean()
  ],
  requestController.createRequest
);

/**
 * @route   GET /api/requests/:id
 * @desc    Get request details by ID
 * @access  Public
 */
router.get('/:id', requestController.getRequest);

export default router;
