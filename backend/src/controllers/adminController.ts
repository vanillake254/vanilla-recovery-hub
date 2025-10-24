import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { generateToken } from '../middleware/auth';

/**
 * Get all recovery requests with pagination and filters
 */
export const getAllRequests = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const status = req.query.status as string;
  const paymentStatus = req.query.paymentStatus as string;
  const platform = req.query.platform as string;

  const where: any = {};
  if (status) where.status = status.toUpperCase();
  if (paymentStatus) where.paymentStatus = paymentStatus.toUpperCase();
  if (platform) where.platform = platform.toUpperCase();

  const skip = (page - 1) * limit;

  const [requests, total] = await Promise.all([
    prisma.request.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.request.count({ where })
  ]);

  res.status(200).json({
    success: true,
    data: {
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  });
});

/**
 * Get single request details with full information
 */
export const getRequestDetails = asyncHandler(async (req: Request, res: Response) => {
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

  // Get payment details
  const payment = await prisma.payment.findUnique({
    where: { requestId: id }
  });

  // Get chat logs
  const chatLogs = await prisma.chatLog.findMany({
    where: { requestId: id },
    orderBy: { createdAt: 'desc' }
  });

  res.status(200).json({
    success: true,
    data: {
      request,
      payment,
      chatLogs
    }
  });
});

/**
 * Add comment/note to request
 */
export const addComment = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { text } = req.body;
  const adminId = req.user._id;

  const request = await prisma.request.findUnique({ where: { id } });
  if (!request) {
    throw new AppError('Request not found', 404);
  }

  // Create a note
  await prisma.note.create({
    data: {
      requestId: id,
      userId: adminId,
      text
    }
  });

  // Fetch updated request with notes
  const updatedRequest = await prisma.request.findUnique({
    where: { id },
    include: {
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

  logger.info(`Comment added to request ${id} by admin ${adminId}`);

  res.status(200).json({
    success: true,
    message: 'Comment added successfully',
    data: updatedRequest
  });
});

/**
 * Update request status
 */
export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { status } = req.body;

  const request = await prisma.request.update({
    where: { id },
    data: { status: status.toUpperCase() },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  if (!request) {
    throw new AppError('Request not found', 404);
  }

  logger.info(`Request ${id} status updated to ${status}`);

  res.status(200).json({
    success: true,
    message: 'Status updated successfully',
    data: request
  });
});

/**
 * Get active and escalated chat sessions
 */
export const getChatSessions = asyncHandler(async (req: Request, res: Response) => {
  const status = req.query.status as string || 'escalated';

  const sessions = await prisma.chatLog.findMany({
    where: { status: status.toUpperCase() as any },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      },
      request: {
        select: {
          platform: true,
          txRef: true
        }
      }
    },
    orderBy: { updatedAt: 'desc' },
    take: 50
  });

  res.status(200).json({
    success: true,
    data: sessions
  });
});

/**
 * Admin reply to chat session
 */
export const replyToChat = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { sessionId, message } = req.body;

  const chatLog = await prisma.chatLog.findUnique({ where: { sessionId } });
  if (!chatLog) {
    throw new AppError('Chat session not found', 404);
  }

  // Parse messages from JSON
  let messages = Array.isArray(chatLog.messages) ? chatLog.messages : [];
  
  messages.push({
    from: 'admin',
    text: message,
    ts: new Date().toISOString()
  });

  // Update chat log
  const updatedChatLog = await prisma.chatLog.update({
    where: { id: chatLog.id },
    data: {
      messages: messages,
      status: 'ACTIVE' // Mark as handled
    }
  });

  logger.info(`Admin replied to chat session ${sessionId}`);

  res.status(200).json({
    success: true,
    message: 'Reply sent successfully',
    data: updatedChatLog
  });
});

/**
 * Get dashboard statistics
 */
export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const [
    totalRequests,
    pendingRequests,
    inProgressRequests,
    resolvedRequests,
    failedRequests,
    totalRevenueResult,
    escalatedChats,
    recentRequests
  ] = await Promise.all([
    prisma.request.count(),
    prisma.request.count({ where: { status: 'NEW' } }),
    prisma.request.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.request.count({ where: { status: 'RESOLVED' } }),
    prisma.request.count({ where: { status: 'FAILED' } }),
    prisma.payment.aggregate({
      where: { status: { in: ['SUCCESSFUL', 'PAID'] } },
      _sum: { amount: true }
    }),
    prisma.chatLog.count({ where: { status: 'ESCALATED' } }),
    prisma.request.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
  ]);

  // Platform breakdown
  const platformStatsRaw = await prisma.request.groupBy({
    by: ['platform'],
    _count: { platform: true }
  });
  
  const platformStats = platformStatsRaw.map(stat => ({
    _id: stat.platform.toLowerCase(),
    count: stat._count.platform
  })).sort((a, b) => b.count - a.count);

  // Payment status breakdown
  const paymentStatsRaw = await prisma.request.groupBy({
    by: ['paymentStatus'],
    _count: { paymentStatus: true }
  });
  
  const paymentStats = paymentStatsRaw.map(stat => ({
    _id: stat.paymentStatus.toLowerCase(),
    count: stat._count.paymentStatus
  }));

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalRequests,
        pendingRequests,
        inProgressRequests,
        resolvedRequests,
        failedRequests,
        totalRevenue: totalRevenueResult._sum.amount || 0,
        escalatedChats
      },
      platformStats,
      paymentStats,
      recentRequests
    }
  });
});

/**
 * Admin login (simplified for MVP - use Firebase in production)
 */
export const adminLogin = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // For MVP: hardcoded admin check
  // In production, verify Firebase token or use proper auth
  if (email === process.env.ADMIN_EMAIL && password === 'admin123') {
    // Find or create admin user
    let admin = await prisma.user.findFirst({
      where: {
        email,
        role: 'ADMIN'
      }
    });
    
    if (!admin) {
      admin = await prisma.user.create({
        data: {
          name: 'Admin',
          email,
          phone: '+254700000000',
          role: 'ADMIN'
        }
      });
    }

    const token = generateToken(admin.id, admin.role.toLowerCase());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role.toLowerCase()
        }
      }
    });
  } else {
    throw new AppError('Invalid credentials', 401);
  }
});
