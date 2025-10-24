'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiXCircle, FiRefreshCw, FiHelpCircle } from 'react-icons/fi';

export default function PaymentFailedPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="animate-fade-in">
            {/* Error Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <FiXCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h1>
              <p className="text-lg text-gray-600">
                Your payment could not be processed at this time
              </p>
            </div>

            {/* Common Reasons */}
            <div className="card mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Common Reasons & Solutions
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 pb-4 border-b border-gray-200">
                  <span className="text-2xl flex-shrink-0">💳</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Insufficient Funds</h3>
                    <p className="text-gray-600 text-sm">
                      Check your M-Pesa balance or card balance and try again
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pb-4 border-b border-gray-200">
                  <span className="text-2xl flex-shrink-0">🔒</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Card Not Enabled for Online Payments</h3>
                    <p className="text-gray-600 text-sm">
                      Contact your bank to enable international/online transactions
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pb-4 border-b border-gray-200">
                  <span className="text-2xl flex-shrink-0">📱</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">M-Pesa PIN Timeout</h3>
                    <p className="text-gray-600 text-sm">
                      If you didn't enter your M-Pesa PIN in time, try the payment again
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <span className="text-2xl flex-shrink-0">🌐</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Connection Issue</h3>
                    <p className="text-gray-600 text-sm">
                      Check your internet connection and try again
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Do */}
            <div className="card mb-6 bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <FiHelpCircle className="w-5 h-5 text-blue-600" />
                <span>What Should I Do?</span>
              </h3>
              <ol className="space-y-2 text-sm text-gray-700 ml-7 list-decimal">
                <li>Check your M-Pesa/bank balance</li>
                <li>Ensure your card is enabled for online transactions</li>
                <li>Clear your browser cache and cookies</li>
                <li>Try a different payment method (M-Pesa if you used card, or vice versa)</li>
                <li>If problem persists, contact your bank or M-Pesa support</li>
              </ol>
            </div>

            {/* Alternative Payment */}
            <div className="card mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                💡 Alternative Payment Methods
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                If you're having trouble with one payment method, try another:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span><strong>M-Pesa:</strong> Fast and easy for Kenyan users</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-600">✓</span>
                  <span><strong>Visa/Mastercard:</strong> Works with any debit or credit card</span>
                </li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/recover" className="btn btn-primary flex-1 text-center flex items-center justify-center space-x-2">
                <FiRefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </Link>
              <button
                onClick={() => window.open('mailto:support@vanillarecoveryhub.com?subject=Payment%20Help%20Needed')}
                className="btn btn-secondary flex-1"
              >
                Contact Support
              </button>
            </div>

            {/* Support Info */}
            <div className="mt-8 text-center text-sm text-gray-600">
              <p>Need help? We're here for you!</p>
              <p className="mt-2">
                Email: <a href="mailto:support@vanillarecoveryhub.com" className="text-primary-600 hover:underline">support@vanillarecoveryhub.com</a>
              </p>
              <p>Mon-Sat: 8 AM - 8 PM EAT</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
