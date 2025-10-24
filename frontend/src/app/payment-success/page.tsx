'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiCheckCircle, FiMail, FiMessageCircle } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const tx_ref = searchParams.get('tx_ref');
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tx_ref) {
      verifyPayment(tx_ref);
    }
  }, [tx_ref]);

  const verifyPayment = async (ref: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/payments/verify/${ref}`);
      if (response.data.data.paymentStatus === 'successful') {
        setVerified(true);
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Verifying your payment...</p>
            </div>
          ) : verified ? (
            <div className="animate-fade-in">
              {/* Success Icon */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <FiCheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Payment Successful! 🎉
                </h1>
                <p className="text-lg text-gray-600">
                  Your recovery process has officially started
                </p>
              </div>

              {/* What's Next Card */}
              <div className="card mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ✅ What Happens Next?
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FiMail className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Check Your Email</h3>
                      <p className="text-gray-600 text-sm">
                        We've sent detailed recovery instructions to your email. Check your inbox (and spam folder) now.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <FiMessageCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Chat Support Unlocked</h3>
                      <p className="text-gray-600 text-sm">
                        Our premium chatbot is now available for all your questions. Click the chat icon anytime!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">👥</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Our Team Will Contact You</h3>
                      <p className="text-gray-600 text-sm">
                        Expect an email or call from our recovery team within 24 hours. Check your phone!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="card mb-6 bg-gray-50">
                <h3 className="font-semibold text-gray-900 mb-3">Transaction Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Reference:</span>
                    <span className="font-mono font-semibold">{tx_ref}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-green-600 font-semibold">✓ Confirmed</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Save this reference number for your records. You can use it to track your case.
                  </p>
                </div>
              </div>

              {/* Important Reminders */}
              <div className="card border-2 border-yellow-200 bg-yellow-50">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>Important Security Reminders</span>
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>We will <strong>NEVER</strong> ask for your password via email, chat, or phone</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>Only follow links from our official domain: vanillarecoveryhub.com</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span>•</span>
                    <span>If someone asks for additional payments, verify with us first</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/" className="btn btn-primary flex-1 text-center">
                  Return to Home
                </Link>
                <button
                  onClick={() => window.open(`mailto:support@vanillarecoveryhub.com?subject=Recovery%20Support%20-%20${tx_ref}`)}
                  className="btn btn-secondary flex-1"
                >
                  Email Support
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-6">
                Unable to verify payment. Please contact support with your transaction reference.
              </p>
              <Link href="/" className="btn btn-primary">
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-2xl">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <main className="min-h-screen bg-gray-50">
        <PaymentSuccessContent />
      </main>
    </Suspense>
  );
}
