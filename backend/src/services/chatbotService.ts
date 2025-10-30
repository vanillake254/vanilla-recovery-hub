import natural from 'natural';
import { logger } from '../utils/logger';
import chatbotTrainingData from '../data/chatbot_training_seed.json';
import prisma from '../lib/prisma';

interface Intent {
  name: string;
  patterns: string[];
  responses: string[];
  context?: string[];
  requires_payment?: boolean;
  escalate?: boolean;
  tags?: string[];
}

interface ChatResponse {
  reply: string;
  intent: string;
  confidence: number;
  shouldEscalate: boolean;
  requiresPayment: boolean;
  suggestions?: string[];
}

class ChatbotService {
  private classifier: any;
  private intents: Intent[];
  private tokenizer: any;
  private isInitialized: boolean = false;

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.classifier = new natural.BayesClassifier();
    this.intents = [];
  }

  /**
   * Initialize and train the chatbot
   * This should be called when the server starts
   */
  async initialize(): Promise<void> {
    try {
      logger.info('Initializing chatbot...');
      // 1) Load seed intents
      this.intents = chatbotTrainingData.intents;

      // 2) Load persisted custom intents from DB (if any)
      try {
        const dbIntents = await prisma.botIntent.findMany({
          orderBy: { createdAt: 'asc' }
        });

        if (dbIntents.length > 0) {
          const existingNames = new Set(this.intents.map(i => i.name));
          for (const dbi of dbIntents) {
            const intent = {
              name: dbi.name,
              patterns: (dbi.patterns as any) as string[],
              responses: (dbi.responses as any) as string[],
              tags: (dbi.tags as any) as string[] | undefined,
              requires_payment: dbi.requiresPayment || false,
              escalate: dbi.escalate || false
            } as any;
            if (!existingNames.has(intent.name)) {
              this.intents.push(intent);
            }
          }
          logger.info(`Loaded ${dbIntents.length} custom intents from DB`);
        }
      } catch (dbErr) {
        logger.warn('Could not load custom intents from DB (will continue with seed):', dbErr);
      }

      // Train classifier with all intents
      for (const intent of this.intents) {
        for (const pattern of intent.patterns) {
          this.classifier.addDocument(pattern.toLowerCase(), intent.name);
        }
      }

      this.classifier.train();
      this.isInitialized = true;

      logger.info(`✅ Chatbot initialized with ${this.intents.length} intents`);
    } catch (error) {
      logger.error('Failed to initialize chatbot:', error);
      throw error;
    }
  }

  /**
   * Process user message and return bot response
   */
  async processMessage(
    message: string,
    context?: Record<string, any>
  ): Promise<ChatResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const normalizedMessage = message.toLowerCase().trim();

    // First try direct pattern matching (more reliable)
    let matchedIntent = null;
    let matchConfidence = 0;

    for (const intent of this.intents) {
      for (const pattern of intent.patterns) {
        const patternLower = pattern.toLowerCase();
        
        // Exact match
        if (normalizedMessage === patternLower) {
          matchedIntent = intent;
          matchConfidence = 1.0;
          break;
        }
        
        // Contains match
        if (normalizedMessage.includes(patternLower) || patternLower.includes(normalizedMessage)) {
          if (matchConfidence < 0.8) {
            matchedIntent = intent;
            matchConfidence = 0.8;
          }
        }
        
        // Word overlap match
        const messageWords = normalizedMessage.split(/\s+/);
        const patternWords = patternLower.split(/\s+/);
        const overlap = messageWords.filter(w => patternWords.includes(w)).length;
        const similarity = overlap / Math.max(messageWords.length, patternWords.length);
        
        if (similarity > matchConfidence && similarity > 0.5) {
          matchedIntent = intent;
          matchConfidence = similarity;
        }
      }
      if (matchConfidence >= 1.0) break;
    }

    // Fallback to Bayes classifier if no direct match
    if (!matchedIntent || matchConfidence < 0.5) {
      const classifications = this.classifier.getClassifications(normalizedMessage);
      const topClassification = classifications[0];
      const bayesConfidence = topClassification.value;
      const intentName = topClassification.label;
      
      if (bayesConfidence > matchConfidence) {
        matchedIntent = this.intents.find(i => i.name === intentName);
        matchConfidence = bayesConfidence;
      }
    }

    logger.debug('Intent matched:', { 
      intent: matchedIntent?.name || 'unknown', 
      confidence: matchConfidence 
    });

    // Handle low confidence or no match
    if (matchConfidence < 0.5 || !matchedIntent) {
      return {
        reply: "I'm not quite sure I understood that. Could you rephrase your question, or would you like to speak with a human support agent?",
        intent: 'unknown',
        confidence: matchConfidence,
        shouldEscalate: matchConfidence < 0.3,
        requiresPayment: false,
        suggestions: [
          "How can I recover my hacked account?",
          "What do I get after I pay?",
          "I need human support"
        ]
      };
    }

    const intent = matchedIntent;

    // Check for escalation intent
    if (intent.escalate) {
      return {
        reply: "I understand you need additional help. Let me connect you with our support team. They'll respond shortly.",
        intent: intent.name,
        confidence: matchConfidence,
        shouldEscalate: true,
        requiresPayment: false
      };
    }

    // Check payment requirement
    if (intent.requires_payment && context?.paymentStatus !== 'paid') {
      return {
        reply: this.getPaymentRequiredResponse(intent),
        intent: intent.name,
        confidence: matchConfidence,
        shouldEscalate: false,
        requiresPayment: true
      };
    }

    // Get contextual response
    const response = this.getContextualResponse(intent, context);

    return {
      reply: response,
      intent: intent.name,
      confidence: matchConfidence,
      shouldEscalate: false,
      requiresPayment: intent.requires_payment || false,
      suggestions: this.getSuggestions(intent.name)
    };
  }

  /**
   * Get contextual response based on intent and user context
   */
  private getContextualResponse(intent: Intent, context?: Record<string, any>): string {
    let response = intent.responses[Math.floor(Math.random() * intent.responses.length)];

    // Replace placeholders with context values
    if (context) {
      response = response.replace(/\{platform\}/g, context.platform || 'your account');
      response = response.replace(/\{name\}/g, context.name || 'there');
      response = response.replace(/\{email\}/g, context.email || 'your email');
    }

    return response;
  }

  /**
   * Get payment required response
   */
  private getPaymentRequiredResponse(intent: Intent): string {
    return "To access detailed recovery steps and premium support, you'll need to complete payment first. After payment, you'll receive:\n\n" +
           "✅ Platform-specific step-by-step recovery instructions\n" +
           "✅ One-on-one chat support\n" +
           "✅ Security checklist PDF\n" +
           "✅ Help setting up 2FA\n" +
           "✅ Priority response from our team\n\n" +
           "Would you like to proceed with payment?";
  }

  /**
   * Get follow-up suggestions based on intent
   */
  private getSuggestions(intentName: string): string[] {
    const suggestionMap: Record<string, string[]> = {
      greeting: [
        "I need help recovering my account",
        "What services do you offer?",
        "How much does it cost?"
      ],
      lost_account: [
        "Do I still have access to my email?",
        "What if my email was also hacked?",
        "How long will recovery take?"
      ],
      payment_question: [
        "What payment methods do you accept?",
        "Can I get a refund?",
        "When should I pay?"
      ],
      security_question: [
        "How do I enable 2FA?",
        "What's a strong password?",
        "How can I secure my account?"
      ]
    };

    return suggestionMap[intentName] || [
      "Tell me more about your service",
      "I'm ready to start recovery",
      "Speak to a human"
    ];
  }

  /**
   * Check if message indicates need for escalation
   */
  needsEscalation(message: string): boolean {
    const escalationKeywords = [
      'human', 'agent', 'person', 'representative', 'talk to someone',
      'not helping', 'frustrated', 'angry', 'urgent', 'emergency',
      'supervisor', 'manager', 'complaint'
    ];

    const lowerMessage = message.toLowerCase();
    return escalationKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  /**
   * Get all available intents (for admin management)
   * Returns intents in reverse order (newest first)
   */
  getAllIntents(): Intent[] {
    return [...this.intents].reverse();
  }

  /**
   * Add new intent (for admin to train bot)
   * Adds at the end of array (will be shown first when reversed)
   */
  addIntent(intent: Intent): void {
    this.intents.push(intent);
    
    // Retrain classifier
    for (const pattern of intent.patterns) {
      this.classifier.addDocument(pattern.toLowerCase(), intent.name);
    }
    
    this.classifier.train();
    logger.info(`New intent added: ${intent.name}`);

    // Persist to DB (best-effort)
    prisma.botIntent.upsert({
      where: { name: intent.name },
      create: {
        name: intent.name,
        patterns: intent.patterns,
        responses: intent.responses,
        tags: intent.tags || [],
        requiresPayment: intent.requires_payment || false,
        escalate: intent.escalate || false
      },
      update: {
        patterns: intent.patterns,
        responses: intent.responses,
        tags: intent.tags || [],
        requiresPayment: intent.requires_payment || false,
        escalate: intent.escalate || false
      }
    }).catch((e) => logger.warn('Failed to persist bot intent (non-fatal):', e));
  }

  /**
   * Get response quality metrics
   */
  getMetrics(): any {
    return {
      totalIntents: this.intents.length,
      totalPatterns: this.intents.reduce((sum, intent) => sum + intent.patterns.length, 0),
      isInitialized: this.isInitialized
    };
  }
}

export default new ChatbotService();
