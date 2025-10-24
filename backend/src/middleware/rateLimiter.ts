import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';

// General API rate limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil(15 * 60) // seconds
    });
  }
});

// Strict rate limiter for payment endpoints
export const paymentRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 payment initiations per hour
  message: 'Too many payment attempts, please try again later.',
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logger.warn(`Payment rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many payment attempts. Please try again in an hour.',
      retryAfter: 3600
    });
  }
});

// Chat rate limiter
export const chatRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 messages per minute
  message: 'Too many messages, please slow down.',
  handler: (req, res) => {
    res.status(429).json({
      error: 'You are sending messages too quickly. Please wait a moment.',
      retryAfter: 60
    });
  }
});
