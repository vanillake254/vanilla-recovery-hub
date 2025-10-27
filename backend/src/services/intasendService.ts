import axios from 'axios';
import { logger } from '../utils/logger';

// IntaSend API Configuration
const INTASEND_BASE_URL = 'https://payment.intasend.com/api/v1';

function getIntaSendHeaders() {
  const INTASEND_SECRET_KEY = process.env.INTASEND_SECRET_KEY || '';
  const INTASEND_PUBLISHABLE_KEY = process.env.INTASEND_PUBLISHABLE_KEY || '';

  if (!INTASEND_SECRET_KEY || !INTASEND_PUBLISHABLE_KEY) {
    throw new Error('IntaSend API keys not configured');
  }

  return {
    'Authorization': `Bearer ${INTASEND_SECRET_KEY}`,
    'Content-Type': 'application/json'
  };
}

interface PaymentPayload {
  amount: number;
  currency: string;
  email: string;
  phone_number?: string;
  name: string;
  api_ref: string; // Your unique transaction reference
  redirect_url?: string;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  checkoutId?: string;
  message?: string;
  error?: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  status?: string;
  amount?: number;
  currency?: string;
  reference?: string;
  message?: string;
  error?: string;
}

class IntaSendService {
  /**
   * Initialize payment checkout
   */
  async initiatePayment(payload: PaymentPayload): Promise<PaymentResponse> {
    try {
      logger.info('Initiating IntaSend payment:', {
        amount: payload.amount,
        email: payload.email,
        reference: payload.api_ref
      });

      // Create payment collection using IntaSend REST API
      const response = await axios.post(
        `${INTASEND_BASE_URL}/payment/collection/`,
        {
          amount: payload.amount,
          currency: payload.currency || 'KES',
          email: payload.email,
          phone_number: payload.phone_number,
          first_name: payload.name.split(' ')[0] || payload.name,
          last_name: payload.name.split(' ')[1] || '',
          api_ref: payload.api_ref,
          redirect_url: payload.redirect_url || process.env.SUCCESS_URL,
          method: 'M-PESA' // Required field: Payment method
        },
        { headers: getIntaSendHeaders() }
      );

      logger.info('IntaSend checkout created:', response.data);

      return {
        success: true,
        paymentUrl: response.data.url,
        checkoutId: response.data.id,
        message: 'Payment checkout created successfully'
      };
    } catch (error: any) {
      logger.error('IntaSend payment initiation failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to initiate payment',
        message: 'Payment initiation failed'
      };
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(checkoutId: string): Promise<VerifyPaymentResponse> {
    try {
      logger.info('Verifying IntaSend payment:', checkoutId);

      // Get status using IntaSend REST API
      const response = await axios.get(
        `${INTASEND_BASE_URL}/payment/collection/${checkoutId}/`,
        { headers: getIntaSendHeaders() }
      );

      const status = response.data;
      logger.info('IntaSend payment status:', status);

      // IntaSend statuses: PENDING, PROCESSING, COMPLETE, FAILED
      const isSuccessful = status.state === 'COMPLETE';

      return {
        success: isSuccessful,
        status: status.state,
        amount: status.value,
        currency: status.currency,
        reference: status.api_ref,
        message: isSuccessful ? 'Payment verified successfully' : `Payment status: ${status.state}`
      };
    } catch (error: any) {
      logger.error('IntaSend payment verification failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to verify payment',
        message: 'Payment verification failed'
      };
    }
  }

  /**
   * Handle webhook notification
   */
  async handleWebhook(payload: any): Promise<boolean> {
    try {
      logger.info('Processing IntaSend webhook:', payload);

      // IntaSend webhook payload structure:
      // {
      //   invoice_id: "...",
      //   state: "COMPLETE",
      //   value: 2000,
      //   api_ref: "your-reference",
      //   ...
      // }

      const { state, api_ref, value } = payload;

      if (state === 'COMPLETE') {
        logger.info('Payment completed via webhook:', {
          reference: api_ref,
          amount: value
        });
        return true;
      }

      return false;
    } catch (error: any) {
      logger.error('IntaSend webhook processing failed:', error);
      return false;
    }
  }

  /**
   * Get payment methods available
   */
  getPaymentMethods(): string[] {
    return [
      'M-PESA',
      'Airtel Money',
      'Bank Transfer',
      'Card' // Currently unavailable but will be back
    ];
  }

  /**
   * Check if service is configured
   */
  isConfigured(): boolean {
    return !!(
      process.env.INTASEND_PUBLISHABLE_KEY &&
      process.env.INTASEND_SECRET_KEY
    );
  }
}

export default new IntaSendService();
