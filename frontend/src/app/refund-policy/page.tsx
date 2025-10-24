'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <div className="space-y-6">
            {/* Eligible for Refund */}
            <div className="card border-2 border-green-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  ✅ You're Eligible for a Full Refund If:
                </h2>
              </div>
              
              <ul className="space-y-3 ml-13">
                <li className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">•</span>
                  <div>
                    <p className="font-semibold text-gray-900">We Don't Respond Within 48 Hours</p>
                    <p className="text-gray-600 text-sm">
                      If you don't receive a response from our team within 48 hours of payment, 
                      you're entitled to a full refund—no questions asked.
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">•</span>
                  <div>
                    <p className="font-semibold text-gray-900">We Determine Recovery Is Impossible</p>
                    <p className="text-gray-600 text-sm">
                      If we assess your case and determine upfront that recovery isn't possible 
                      (e.g., account permanently banned), we'll refund you immediately.
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">•</span>
                  <div>
                    <p className="font-semibold text-gray-900">We Fail to Deliver Promised Service</p>
                    <p className="text-gray-600 text-sm">
                      If we don't provide the recovery instructions or support as described 
                      in your chosen tier (Basic or Premium).
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <span className="text-green-600 font-bold">•</span>
                  <div>
                    <p className="font-semibold text-gray-900">Technical Error on Our End</p>
                    <p className="text-gray-600 text-sm">
                      Payment processed but you didn't receive confirmation email or access to services.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* NOT Eligible for Refund */}
            <div className="card border-2 border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiXCircle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  ❌ No Refund If:
                </h2>
              </div>
              
              <ul className="space-y-3 ml-13">
                <li className="flex items-start space-x-3">
                  <span className="text-red-600 font-bold">•</span>
                  <div>
                    <p className="font-semibold text-gray-900">Platform Denies Recovery (Not Our Fault)</p>
                    <p className="text-gray-600 text-sm">
                      If the platform (Facebook, Instagram, etc.) denies your recovery request, 
                      that's beyond our control. We provide guidance, but they make the final decision.
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <span className="text-red-600 font-bold">•</span>
                  <div>
                    <p className="font-semibold text-gray-900">You Didn't Follow Instructions</p>
                    <p className="text-gray-600 text-sm">
                      If you didn't complete the recovery steps we provided or didn't respond to our 
                      follow-up communications.
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <span className="text-red-600 font-bold">•</span>
                  <div>
                    <p className="font-semibold text-gray-900">Incorrect Information Provided</p>
                    <p className="text-gray-600 text-sm">
                      If you provided wrong account details, email, or other inaccurate information 
                      that prevented successful recovery.
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <span className="text-red-600 font-bold">•</span>
                  <div>
                    <p className="font-semibold text-gray-900">Account Permanently Banned for Violations</p>
                    <p className="text-gray-600 text-sm">
                      If your account was disabled for violating platform policies (hate speech, spam, etc.), 
                      platforms rarely restore these accounts.
                    </p>
                  </div>
                </li>

                <li className="flex items-start space-x-3">
                  <span className="text-red-600 font-bold">•</span>
                  <div>
                    <p className="font-semibold text-gray-900">Change of Mind</p>
                    <p className="text-gray-600 text-sm">
                      After we've delivered the service (sent instructions, provided support), 
                      you can't request a refund simply because you changed your mind.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Refund Process */}
            <div className="card bg-blue-50 border-blue-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📋 How to Request a Refund
              </h2>
              
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-gray-800">
                  <strong>Email us at:</strong> refunds@vanillarecoveryhub.com
                </li>
                <li className="text-gray-800">
                  <strong>Include:</strong> Your transaction reference (TX_REF), email, and reason
                </li>
                <li className="text-gray-800">
                  <strong>Timeline:</strong> We'll review and respond within 3 business days
                </li>
                <li className="text-gray-800">
                  <strong>Processing:</strong> Approved refunds are processed within 5-7 business days
                </li>
                <li className="text-gray-800">
                  <strong>Method:</strong> Refunds go back to your original payment method (M-Pesa or card)
                </li>
              </ol>

              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-blue-900 text-sm">
                  <strong>Note:</strong> Refund requests must be submitted within 14 days of payment.
                </p>
              </div>
            </div>

            {/* Partial Refunds */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🔄 Partial Refunds
              </h2>
              
              <p className="text-gray-700 mb-4">
                In some cases, we may offer a partial refund:
              </p>

              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600">•</span>
                  <span className="text-gray-700">
                    You received some service but not all (e.g., got email instructions but not screen-share support in Premium)
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-primary-600">•</span>
                  <span className="text-gray-700">
                    Delayed response from our team (beyond 48 hours but service was provided)
                  </span>
                </li>
              </ul>
            </div>

            {/* Money-Back Guarantee */}
            <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                💯 Our Money-Back Guarantee
              </h2>
              
              <p className="text-gray-800 text-lg mb-4">
                We're confident in our service. If we fail to deliver what we promise, 
                you get your money back. Simple as that.
              </p>

              <div className="bg-white p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>What we promise:</strong>
                </p>
                <ul className="mt-2 space-y-1">
                  <li className="text-gray-600">✓ Response within 48 hours</li>
                  <li className="text-gray-600">✓ Professional recovery guidance</li>
                  <li className="text-gray-600">✓ Platform-specific instructions</li>
                  <li className="text-gray-600">✓ Support until case resolution</li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="card bg-gray-800 text-white">
              <h2 className="text-2xl font-bold mb-4">
                📞 Questions About Refunds?
              </h2>
              
              <p className="mb-4">
                Contact our support team:
              </p>

              <ul className="space-y-2">
                <li>
                  <strong>Refund Inquiries:</strong> refunds@vanillarecoveryhub.com
                </li>
                <li>
                  <strong>General Support:</strong> support@vanillarecoveryhub.com
                </li>
                <li>
                  <strong>Hours:</strong> Monday-Saturday, 8 AM - 8 PM EAT
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
