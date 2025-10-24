import axios from 'axios';
import crypto from 'crypto';
import { logger } from '../utils/logger';

const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';

interface PaymentPayload {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    name: string;
    phonenumber?: string;
  };
  customizations?: {
    title: string;
    description: string;
    logo?: string;
  };
  payment_options?: string;
  meta?: Record<string, any>;
}

interface InitiatePaymentResponse {
  status: string;
  message: string;
  data: {
    link: string;
  };
}

interface VerifyPaymentResponse {
  status: string;
  message: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    charged_amount: number;
    status: string;
    payment_type: string;
    customer: {
      email: string;
      name: string;
    };
    created_at: string;
  };
}

class PaymentService {
  private secretKey: string;
  private publicKey: string;

  constructor() {
    this.secretKey = process.env.FLW_SECRET_KEY || '';
    this.publicKey = process.env.FLW_PUBLIC_KEY || '';

    if (!this.secretKey || !this.publicKey) {
      logger.error('Flutterwave API keys not configured');
    }
  }

  /**
   * Initiate a payment with Flutterwave
   * Returns a payment link for the customer
   */
  async initiatePayment(payload: PaymentPayload): Promise<InitiatePaymentResponse> {
    try {
      const response = await axios.post(
        `${FLUTTERWAVE_BASE_URL}/payments`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`Payment initiated: ${payload.tx_ref}`);
      return response.data;
    } catch (error: any) {
      logger.error('Flutterwave payment initiation failed:', {
        error: error.response?.data || error.message,
        tx_ref: payload.tx_ref
      });
      throw new Error('Failed to initiate payment');
    }
  }

  /**
   * Verify a payment transaction
   * CRITICAL: Always verify payments via API, never trust redirect alone
   */
  async verifyPayment(transactionId: string): Promise<VerifyPaymentResponse> {
    try {
      const response = await axios.get(
        `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      logger.info(`Payment verified: ${transactionId}`, {
        status: response.data.data.status,
        amount: response.data.data.amount
      });

      return response.data;
    } catch (error: any) {
      logger.error('Payment verification failed:', {
        error: error.response?.data || error.message,
        transactionId
      });
      throw new Error('Failed to verify payment');
    }
  }

  /**
   * Verify webhook signature
   * IMPORTANT: Always verify webhook signatures before processing
   */
  verifyWebhookSignature(signature: string, payload: any): boolean {
    const secretHash = process.env.FLW_SECRET_KEY || '';
    const hash = crypto
      .createHmac('sha256', secretHash)
      .update(JSON.stringify(payload))
      .digest('hex');
    
    const isValid = hash === signature;
    
    if (!isValid) {
      logger.warn('Invalid webhook signature detected');
    }
    
    return isValid;
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${FLUTTERWAVE_BASE_URL}/transactions/${transactionId}/verify`,
        {
          headers: {
            'Authorization': `Bearer ${this.secretKey}`
          }
        }
      );

      return response.data;
    } catch (error: any) {
      logger.error('Failed to get transaction:', {
        error: error.response?.data || error.message,
        transactionId
      });
      throw new Error('Failed to get transaction details');
    }
  }
}

export default new PaymentService();
