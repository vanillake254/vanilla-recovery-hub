'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="card prose max-w-none">
            <p className="text-gray-600 mb-6">
              <strong>Last Updated:</strong> January 19, 2024
            </p>

            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us when you use our account recovery services:
            </p>
            <ul>
              <li><strong>Personal Information:</strong> Name, email address, phone number</li>
              <li><strong>Recovery Details:</strong> Platform information, account description</li>
              <li><strong>Payment Information:</strong> Processed securely by IntaSend (we don't store card details)</li>
              <li><strong>Chat Logs:</strong> Conversations with our chatbot for support purposes</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Provide account recovery services</li>
              <li>Process payments</li>
              <li>Send service-related emails (confirmations, updates)</li>
              <li>Improve our chatbot and services</li>
              <li>Respond to your inquiries</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>We DO NOT sell or share your personal information with third parties, except:</p>
            <ul>
              <li><strong>Payment Processor:</strong> IntaSend processes payments securely</li>
              <li><strong>Email Service:</strong> Resend sends transactional emails</li>
              <li><strong>Legal Requirements:</strong> When required by law</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement industry-standard security measures:
            </p>
            <ul>
              <li>HTTPS encryption for all data transmission</li>
              <li>Secure database with access controls</li>
              <li>Regular security audits</li>
              <li>We NEVER ask for your passwords</li>
            </ul>

            <h2>5. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide services and comply with legal obligations. 
              You may request deletion of your data by contacting us.
            </p>

            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing emails</li>
              <li>File a complaint with data protection authorities</li>
            </ul>

            <h2>7. Cookies</h2>
            <p>
              We use essential cookies for:
            </p>
            <ul>
              <li>Session management</li>
              <li>Chatbot functionality</li>
              <li>User preferences</li>
            </ul>
            <p>We do not use tracking or advertising cookies.</p>

            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under 18. We do not knowingly collect information from children.
            </p>

            <h2>9. Changes to Privacy Policy</h2>
            <p>
              We may update this policy periodically. Significant changes will be communicated via email.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              For privacy-related questions or to exercise your rights:
            </p>
            <ul>
              <li>Email: privacy@vanillarecoveryhub.com</li>
              <li>Support: support@vanillarecoveryhub.com</li>
            </ul>

            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-900 mb-2">🔒 Our Privacy Commitment</p>
              <p className="text-blue-800 text-sm">
                We will NEVER ask for your passwords. We will NEVER sell your data. 
                We only collect what's necessary to help you recover your account.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
