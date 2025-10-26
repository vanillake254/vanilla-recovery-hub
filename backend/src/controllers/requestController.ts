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

  const { name, email, phone, platform, description, hasEmailAccess } = req.body;

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
      description: description || '',
      hasEmailAccess: hasEmailAccess !== undefined ? hasEmailAccess : null,
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

/**
 * Track request by transaction reference
 */
export const trackRequest = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { txRef } = req.params;

  const request = await prisma.request.findUnique({
    where: { txRef },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      notes: {
        include: {
          user: {
            select: {
              name: true
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
      request,
      notes: request.notes
    }
  });
});

/**
 * Get all requests for a user by email or phone
 */
export const getUserRequests = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { identifier } = req.params;

  // Find user by email or phone
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { phone: identifier }
      ]
    }
  });

  if (!user) {
    return res.status(200).json({
      success: true,
      data: {
        requests: [],
        message: 'No requests found for this email/phone'
      }
    });
  }

  // Get all requests for this user
  const requests = await prisma.request.findMany({
    where: { userId: user.id },
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
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.status(200).json({
    success: true,
    data: {
      requests,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    }
  });
});

/**
 * Customer adds message to their request
 */
export const addCustomerMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { text } = req.body;

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      user: true
    }
  });

  if (!request) {
    throw new AppError('Request not found', 404);
  }

  // Create note from customer
  const note = await prisma.note.create({
    data: {
      requestId: id,
      userId: request.userId,
      text
    }
  });

  // Notify admin via email
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vanillarecoveryhub.com';
    await emailService.sendAdminNotification(
      request.platform.toLowerCase(),
      request.id,
      request.user.name,
      request.user.email,
      `Customer message: ${text}`
    );
    logger.info(`Customer message notification sent for request ${id}`);
  } catch (error) {
    logger.error('Failed to send customer message notification:', error);
  }

  res.status(200).json({
    success: true,
    message: 'Message sent successfully',
    data: note
  });
});
