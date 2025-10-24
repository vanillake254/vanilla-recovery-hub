'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          
          <div className="card prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> January 19, 2024
            </p>

            <p>
              By using Vanilla Recovery Hub ("the Service"), you agree to these Terms of Service. 
              Please read them carefully.
            </p>

            <h2>1. Service Description</h2>
            <p>
              Vanilla Recovery Hub provides account recovery guidance and support for social media and email platforms. 
              We offer two service tiers: Basic (KES 1,500) and Premium (KES 3,000).
            </p>

            <h2>2. What We Provide</h2>
            <ul>
              <li>Platform-specific recovery instructions</li>
              <li>Email and chat support</li>
              <li>Security guidance and best practices</li>
              <li>Premium: Screen-share assistance and priority support</li>
            </ul>

            <h2>3. What We Don't Provide</h2>
            <ul>
              <li><strong>We will NEVER ask for your password</strong></li>
              <li>We cannot guarantee 100% recovery success (depends on platform policies)</li>
              <li>We cannot recover accounts permanently banned for policy violations</li>
              <li>We are not affiliated with Facebook, Instagram, Google, or other platforms</li>
            </ul>

            <h2>4. Payment Terms</h2>
            <ul>
              <li>All payments are processed securely via Flutterwave</li>
              <li>Prices are in Kenyan Shillings (KES)</li>
              <li>Payment is required before receiving recovery instructions</li>
              <li>Refunds are subject to our Refund Policy (see below)</li>
            </ul>

            <h2>5. Refund Policy</h2>
            <p>
              <strong>You are eligible for a full refund if:</strong>
            </p>
            <ul>
              <li>We don't respond within 48 hours of payment</li>
              <li>We determine your case is unrecoverable before providing service</li>
              <li>We fail to provide the promised service</li>
            </ul>

            <p>
              <strong>No refunds if:</strong>
            </p>
            <ul>
              <li>Your account was permanently disabled by the platform for policy violations</li>
              <li>You don't follow our recovery instructions</li>
              <li>You provided incorrect information</li>
              <li>The platform denies recovery (beyond our control)</li>
            </ul>

            <p>Refund requests must be submitted within 14 days.</p>

            <h2>6. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate information</li>
              <li>Follow our recovery instructions</li>
              <li>Respond to our communications promptly</li>
              <li>Not use the service for illegal activities</li>
              <li>Not share your credentials with our team</li>
              <li>Maintain confidentiality of recovery guidance</li>
            </ul>

            <h2>7. Privacy & Security</h2>
            <p>
              We take your privacy seriously. Please review our <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>. 
              Key points:
            </p>
            <ul>
              <li>We NEVER ask for passwords</li>
              <li>We don't share your data with third parties</li>
              <li>All communications are encrypted</li>
            </ul>

            <h2>8. Limitation of Liability</h2>
            <p>
              Vanilla Recovery Hub is not liable for:
            </p>
            <ul>
              <li>Actions taken by social media platforms</li>
              <li>Data loss during the recovery process</li>
              <li>Unsuccessful recovery attempts (platform-dependent)</li>
              <li>Any consequential or indirect damages</li>
            </ul>
            <p>
              Our maximum liability is limited to the amount you paid for the service.
            </p>

            <h2>9. Platform Policies</h2>
            <p>
              Account recovery success depends on:
            </p>
            <ul>
              <li>Platform-specific policies and procedures</li>
              <li>Whether you have supporting documentation (ID, email access)</li>
              <li>Reason for account loss</li>
              <li>Account history and age</li>
            </ul>
            <p>
              We provide guidance, but platforms make the final decision.
            </p>

            <h2>10. Intellectual Property</h2>
            <p>
              All content, including recovery guides and chatbot responses, is proprietary to Vanilla Recovery Hub. 
              You may not reproduce or redistribute our materials without permission.
            </p>

            <h2>11. Termination</h2>
            <p>
              We reserve the right to refuse service or terminate access if you:
            </p>
            <ul>
              <li>Violate these terms</li>
              <li>Provide false information</li>
              <li>Engage in abusive behavior toward our team</li>
              <li>Use the service for illegal purposes</li>
            </ul>

            <h2>12. Changes to Terms</h2>
            <p>
              We may update these terms periodically. Continued use of the service constitutes acceptance of new terms. 
              Significant changes will be communicated via email.
            </p>

            <h2>13. Governing Law</h2>
            <p>
              These terms are governed by the laws of Kenya. Any disputes will be resolved in Kenyan courts.
            </p>

            <h2>14. Support & Contact</h2>
            <p>
              For questions about these terms:
            </p>
            <ul>
              <li>Email: legal@vanillarecoveryhub.com</li>
              <li>Support: support@vanillarecoveryhub.com</li>
              <li>Hours: Monday-Saturday, 8 AM - 8 PM EAT</li>
            </ul>

            <h2>15. Acceptance</h2>
            <p>
              By submitting a recovery request and making payment, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service.
            </p>

            <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-semibold text-green-900 mb-2">✅ Our Commitment to You</p>
              <p className="text-green-800 text-sm">
                We're committed to providing professional, ethical account recovery services. 
                We'll always be transparent, never ask for passwords, and do our best to help you 
                regain access to your account.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
