import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../lib/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import emailService from '../services/emailService';

/**
 * Create a new recovery request
 */
export const createRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, platform, description, hasEmailAccess, tier, accountInfo } = req.body;

  // Check if user exists, otherwise create
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        role: 'USER'
      }
    });
    logger.info(`New user created: ${email}`);
  }

  // Generate unique transaction reference
  const tx_ref = `VRH-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;

  // Create recovery request
  const request = await prisma.request.create({
    data: {
      userId: user.id,
      platform: platform.toUpperCase(),
      tier: tier || 'basic',
      description: description || '',
      hasEmailAccess: hasEmailAccess !== undefined ? hasEmailAccess : null,
      accountInfo: accountInfo || {},
      status: 'NEW',
      txRef: tx_ref,
      paymentStatus: 'PENDING'
    }
  });

  logger.info(`Recovery request created: ${request.id} for ${platform}`);

  // Send admin notification (non-blocking)
  emailService.sendAdminNotification(
    platform,
    request.id,
    name,
    email
  ).catch(err => logger.error('Admin notification failed:', err));

  // Return request details
  res.status(201).json({
    success: true,
    message: 'Recovery request created successfully',
    data: {
      requestId: request.id,
      tx_ref: request.txRef,
      platform: request.platform.toLowerCase(),
      status: request.status.toLowerCase(),
      paymentStatus: request.paymentStatus.toLowerCase(),
      user: {
        name: user.name,
        email: user.email
      }
    }
  });
});

/**
 * Get request details
 */
export const getRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true
        }
      },
      notes: {
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!request) {
    throw new AppError('Request not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      ...request,
      platform: request.platform.toLowerCase(),
      status: request.status.toLowerCase(),
      paymentStatus: request.paymentStatus.toLowerCase()
    }
  });
});
