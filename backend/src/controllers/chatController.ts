import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../lib/prisma';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import chatbotService from '../services/chatbotService';
import emailService from '../services/emailService';

/**
 * Send message to chatbot
 */
export const sendMessage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { sessionId, message, context } = req.body;

  // Find or create chat session
  let chatLog = await prisma.chatLog.findUnique({ where: { sessionId } });
  
  if (!chatLog) {
    chatLog = await prisma.chatLog.create({
      data: {
        sessionId,
        messages: [],
        status: 'ACTIVE',
        context: context || {}
      }
    });
    logger.info(`New chat session created: ${sessionId}`);
  }

  // Parse messages from JSON
  let messages = Array.isArray(chatLog.messages) ? chatLog.messages : [];
  let chatContext = typeof chatLog.context === 'object' ? chatLog.context : {};

  // Update context if provided
  if (context) {
    chatContext = { ...chatContext, ...context };
  }

  // Check if user has paid (if requestId exists)
  let paymentStatus = 'pending';
  if (chatLog.requestId) {
    const request = await prisma.request.findUnique({
      where: { id: chatLog.requestId }
    });
    if (request) {
      paymentStatus = request.paymentStatus.toLowerCase();
      chatContext = {
        ...chatContext,
        paymentStatus,
        platform: request.platform.toLowerCase()
      };
    }
  }

  // Add user message to log
  messages.push({
    from: 'user',
    text: message,
    ts: new Date().toISOString()
  });

  // Process message with chatbot
  const botResponse = await chatbotService.processMessage(message, chatContext);

  // Add bot response to log
  messages.push({
    from: 'bot',
    text: botResponse.reply,
    ts: new Date().toISOString(),
    intent: botResponse.intent,
    confidence: botResponse.confidence
  });

  // Handle escalation
  let newStatus = chatLog.status;
  if (botResponse.shouldEscalate || chatbotService.needsEscalation(message)) {
    newStatus = 'ESCALATED';
    
    // Send escalation notification to admin
    emailService.sendEscalationNotification(
      sessionId,
      (chatContext as any)?.name || 'User',
      message
    ).catch(err => logger.error('Escalation notification failed:', err));

    logger.info(`Chat escalated: ${sessionId}`);
  }

  // Update chat log
  await prisma.chatLog.update({
    where: { id: chatLog.id },
    data: {
      messages: messages,
      context: chatContext,
      status: newStatus
    }
  });

  res.status(200).json({
    success: true,
    data: {
      reply: botResponse.reply,
      intent: botResponse.intent,
      confidence: botResponse.confidence,
      suggestions: botResponse.suggestions,
      requiresPayment: botResponse.requiresPayment,
      escalated: newStatus === 'ESCALATED'
    }
  });
});

/**
 * Get chat session history
 */
export const getSession = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { sessionId } = req.params;

  const chatLog = await prisma.chatLog.findUnique({
    where: { sessionId },
    include: {
      request: true,
      user: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  if (!chatLog) {
    throw new AppError('Chat session not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      ...chatLog,
      status: chatLog.status.toLowerCase()
    }
  });
});
