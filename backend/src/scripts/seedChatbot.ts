/**
 * Seed script to initialize chatbot training data
 * Run: npm run seed
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chatbotService from '../services/chatbotService';
import { logger } from '../utils/logger';

dotenv.config();

const seedChatbot = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not defined');
    }

    await mongoose.connect(mongoUri);
    logger.info('Connected to MongoDB');

    // Initialize chatbot (this loads and trains from chatbot_training_seed.json)
    await chatbotService.initialize();
    logger.info('✅ Chatbot initialized and trained successfully');

    // Test the chatbot
    const testMessage = "My Facebook is hacked";
    const response = await chatbotService.processMessage(testMessage, {});
    
    logger.info('Test chatbot response:', {
      message: testMessage,
      intent: response.intent,
      confidence: response.confidence,
      reply: response.reply.substring(0, 100) + '...'
    });

    logger.info('✅ Chatbot seed completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Chatbot seed failed:', error);
    process.exit(1);
  }
};

seedChatbot();
