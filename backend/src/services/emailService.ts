import { Resend } from 'resend';
import { logger } from '../utils/logger';

class EmailService {
  private resend: Resend;
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.EMAIL_API_KEY || '';
    this.resend = new Resend(apiKey);
    this.fromEmail = process.env.ADMIN_EMAIL || 'noreply@vanillarecoveryhub.com';

    if (!apiKey) {
      logger.warn('Email API key not configured. Email sending will fail.');
    }
  }

  /**
   * Send payment confirmation and recovery instructions
   */
  async sendPaymentConfirmation(
    to: string,
    name: string,
    platform: string,
    amount: number,
    tx_ref: string,
    requestId: string
  ): Promise<void> {
    try {
      const recoverySteps = this.getRecoverySteps(platform);

      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: '✅ Payment Confirmed - Your Recovery Process Starts Now',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .success-badge { background: #10B981; color: white; padding: 10px 20px; border-radius: 6px; display: inline-block; margin: 15px 0; }
              .info-box { background: white; border-left: 4px solid #4F46E5; padding: 15px; margin: 20px 0; }
              .steps { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; }
              .step { margin: 15px 0; padding-left: 30px; position: relative; }
              .step::before { content: "✓"; position: absolute; left: 0; color: #10B981; font-weight: bold; font-size: 18px; }
              .cta-button { background: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
              .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Payment Successful!</h1>
              </div>
              <div class="content">
                <p>Hi <strong>${name}</strong>,</p>
                
                <div class="success-badge">
                  Payment Confirmed ✓
                </div>

                <p>We've received your payment and your ${platform} account recovery process has officially started!</p>

                <div class="info-box">
                  <strong>Payment Details:</strong><br>
                  Amount: KES ${amount.toLocaleString()}<br>
                  Transaction Reference: ${tx_ref}<br>
                  Request ID: ${requestId}
                </div>

                <h2>🔐 Next Steps - ${platform} Recovery</h2>
                
                <div class="steps">
                  ${recoverySteps}
                </div>

                <h3>What You Get:</h3>
                <div class="step">Personal case analysis and platform-specific guidance</div>
                <div class="step">One-on-one chat support for follow-up questions</div>
                <div class="step">Security checklist PDF (attached)</div>
                <div class="step">Help enabling 2FA and securing your account</div>

                <a href="${process.env.FRONTEND_URL}/chat?session=${requestId}" class="cta-button">
                  💬 Start Live Chat Support
                </a>

                <p><strong>Important Security Reminder:</strong></p>
                <p style="background: #FEF3C7; padding: 15px; border-radius: 6px; border-left: 4px solid #F59E0B;">
                  ⚠️ We will <strong>NEVER</strong> ask for your password. If someone claiming to be from Vanilla Recovery Hub asks for your password, it's a scam. Report it immediately.
                </p>

                <p>Our team will reach out within 24 hours. Meanwhile, you can use our chatbot for instant answers.</p>

                <p>Stay safe,<br>
                <strong>Vanilla Recovery Hub Team</strong></p>
              </div>

              <div class="footer">
                <p>Vanilla Recovery Hub | Digital Safety & Account Recovery</p>
                <p>Need help? Reply to this email or visit our support chat</p>
                <p style="font-size: 10px; color: #999;">
                  This is an automated email. Please do not reply directly to this address.
                </p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      logger.info(`Payment confirmation email sent to ${to}`);
    } catch (error) {
      logger.error('Failed to send payment confirmation email:', error);
      // Don't throw - email failure shouldn't break the payment flow
    }
  }

  /**
   * Send admin notification for new request
   */
  async sendAdminNotification(
    platform: string,
    requestId: string,
    customerName: string,
    customerEmail: string
  ): Promise<void> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || '';
      
      await this.resend.emails.send({
        from: this.fromEmail,
        to: adminEmail,
        subject: `🆕 New Recovery Request - ${platform}`,
        html: `
          <h2>New Recovery Request Received</h2>
          <p><strong>Platform:</strong> ${platform}</p>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Request ID:</strong> ${requestId}</p>
          <p><strong>Status:</strong> Payment Pending</p>
          <p><a href="${process.env.FRONTEND_URL}/admin/requests/${requestId}">View in Dashboard</a></p>
        `
      });

      logger.info('Admin notification sent for request:', requestId);
    } catch (error) {
      logger.error('Failed to send admin notification:', error);
    }
  }

  /**
   * Send escalation notification to admin
   */
  async sendEscalationNotification(
    sessionId: string,
    userName: string,
    lastMessage: string
  ): Promise<void> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || '';
      
      await this.resend.emails.send({
        from: this.fromEmail,
        to: adminEmail,
        subject: '🚨 Chat Escalation - User Needs Human Support',
        html: `
          <h2>Chat Escalation Alert</h2>
          <p><strong>User:</strong> ${userName}</p>
          <p><strong>Session ID:</strong> ${sessionId}</p>
          <p><strong>Last Message:</strong> "${lastMessage}"</p>
          <p><a href="${process.env.FRONTEND_URL}/admin/chat/${sessionId}">Respond Now</a></p>
        `
      });

      logger.info('Escalation notification sent for session:', sessionId);
    } catch (error) {
      logger.error('Failed to send escalation notification:', error);
    }
  }

  /**
   * Send admin message to customer
   */
  async sendAdminMessage(
    to: string,
    name: string,
    message: string,
    platform: string,
    requestId: string
  ): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: '📨 New Message from Vanilla Recovery Hub Support',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .message-box { background: white; border-left: 4px solid #4F46E5; padding: 20px; margin: 20px 0; border-radius: 6px; }
              .info-box { background: #E0E7FF; padding: 15px; margin: 20px 0; border-radius: 6px; }
              .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>💬 Message from Support</h1>
              </div>
              <div class="content">
                <p>Hi <strong>${name}</strong>,</p>
                
                <p>Our team has sent you an update regarding your <strong>${platform}</strong> account recovery request.</p>

                <div class="message-box">
                  <strong>Message from Support Team:</strong><br><br>
                  ${message.replace(/\n/g, '<br>')}
                </div>

                <div class="info-box">
                  <strong>💡 Need to reply?</strong><br>
                  Simply reply to this email, and our team will get back to you within 24 hours.
                </div>

                <p><strong>Your Request ID:</strong> ${requestId}</p>

                <p>Best regards,<br>
                <strong>Vanilla Recovery Hub Support Team</strong></p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Vanilla Recovery Hub. All rights reserved.</p>
                <p>Nairobi, Kenya | Always available to help</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      logger.info(`Admin message email sent to ${to}`);
    } catch (error) {
      logger.error('Failed to send admin message email:', error);
      throw error;
    }
  }

  /**
   * Get platform-specific recovery steps
   */
  private getRecoverySteps(platform: string): string {
    const steps: Record<string, string> = {
      facebook: `
        <div class="step">Try to reset your password using your email or phone number</div>
        <div class="step">Check if you still have access to your recovery email or phone</div>
        <div class="step">Look for "My Account Is Compromised" option on Facebook login page</div>
        <div class="step">Upload a photo ID if Facebook requests verification</div>
        <div class="step">Check your email for any security alerts from Facebook</div>
      `,
      instagram: `
        <div class="step">Try "Forgot Password" on Instagram login page</div>
        <div class="step">Use "Get Help Signing In" option</div>
        <div class="step">Request a login link sent to your email or phone</div>
        <div class="step">If email/phone changed, tap "Need more help?"</div>
        <div class="step">Upload a photo holding a code (Instagram will send you one)</div>
      `,
      gmail: `
        <div class="step">Go to Google Account Recovery page</div>
        <div class="step">Enter your Gmail address and click "Forgot password"</div>
        <div class="step">Try all recovery options (phone, email, security questions)</div>
        <div class="step">Check for recovery email in your backup email addresses</div>
        <div class="step">Complete identity verification if prompted</div>
      `,
      tiktok: `
        <div class="step">Open TikTok app and tap "Forgot password?"</div>
        <div class="step">Try recovery via phone number or email</div>
        <div class="step">If email/phone changed, contact TikTok support in-app</div>
        <div class="step">Provide proof of identity (video selfie may be required)</div>
        <div class="step">Check spam folder for TikTok recovery emails</div>
      `,
      youtube: `
        <div class="step">YouTube uses Google account - follow Gmail recovery steps</div>
        <div class="step">Go to accounts.google.com/signin/recovery</div>
        <div class="step">Enter your YouTube/Gmail address</div>
        <div class="step">Try recovery via phone, email, or security questions</div>
        <div class="step">Once recovered, secure with 2FA immediately</div>
      `,
      default: `
        <div class="step">Attempt password reset using platform's official recovery</div>
        <div class="step">Check email/phone access for recovery codes</div>
        <div class="step">Look for "Account Compromised" or similar options</div>
        <div class="step">Gather proof of ownership (old posts, photos, etc.)</div>
        <div class="step">Contact platform support with your case details</div>
      `
    };

    return steps[platform.toLowerCase()] || steps.default;
  }
}

export default new EmailService();
