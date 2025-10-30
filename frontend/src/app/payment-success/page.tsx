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
  const transaction_id = searchParams.get('transaction_id');
  const urlStatus = searchParams.get('status') || searchParams.get('state'); // IntaSend may use state=COMPLETE
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // If payment provider redirected with success, show success immediately
    if (urlStatus && ['successful', 'success', 'complete', 'COMPLETE'].includes(urlStatus)) {
      console.log('Payment successful based on URL status parameter');
      setVerified(true);
      setLoading(false);
      
      // Save to localStorage
      if (tx_ref) {
        localStorage.setItem('paymentVerified', 'true');
        localStorage.setItem('lastTxRef', tx_ref);
      }
      return; // Don't verify with backend if URL says successful
    }
    
    if (tx_ref) {
      verifyPayment(tx_ref, transaction_id);
    }
  }, [tx_ref, transaction_id, urlStatus]);

  const verifyPayment = async (ref: string, transactionId: string | null, isRetry = false) => {
    try {
      console.log('Verifying payment with ref:', ref, 'transaction_id:', transactionId);
      
      // Build URL with transaction_id if available
      const verifyUrl = transactionId 
        ? `${API_URL}/api/payments/verify/${ref}?transaction_id=${transactionId}`
        : `${API_URL}/api/payments/verify/${ref}`;
      
      const response = await axios.get(verifyUrl);
      console.log('Payment verification response:', response.data);
      const data = response.data.data;
      
      if (data.paymentStatus === 'successful' || data.paymentStatus === 'SUCCESSFUL') {
        setVerified(true);
        
        // Save user info from payment data
        if (data.request) {
          const { email, phone, platform } = data.request;
          if (email) {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('paymentVerified', 'true');
          }
          if (phone) {
            localStorage.setItem('userPhone', phone);
          }
          if (platform) {
            localStorage.setItem('userPlatform', platform);
          }
        }
      } else {
        console.log('Payment status not successful:', data.paymentStatus);
        
        // Retry up to 3 times with delays (webhooks might be slow)
        if (retryCount < 3) {
          console.log(`Retrying verification in 3 seconds... (Attempt ${retryCount + 1}/3)`);
          setTimeout(() => {
            setRetryCount(retryCount + 1);
            verifyPayment(ref, transactionId, true);
          }, 3000);
          return; // Don't set loading to false yet
        } else {
          console.log('Max retries reached. Payment status:', data.paymentStatus);
          setLoading(false); // Stop loading after max retries
        }
      }
    } catch (error: any) {
      console.error('Payment verification failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Retry on network errors
      if (retryCount < 3 && (error.code === 'ERR_NETWORK' || error.response?.status >= 500)) {
        console.log(`Retrying verification in 3 seconds... (Attempt ${retryCount + 1}/3)`);
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          verifyPayment(ref, transactionId, true);
        }, 3000);
        return; // Don't set loading to false yet
      } else {
        setLoading(false); // Stop loading after error
      }
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
              <p className="mt-4 text-gray-600">
                Verifying your payment...
                {retryCount > 0 && ` (Attempt ${retryCount + 1}/4)`}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                This may take a few moments as we confirm with the payment gateway
              </p>
            </div>
          ) : verified || searchParams.get('status') === 'successful' ? (
            <div className="animate-fade-in">
              {/* Success Icon */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <FiCheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Payment Successful! 🎉
                </h1>
                <p className="text-lg text-gray-600">Your recovery process has officially started</p>
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
                      <h3 className="font-semibold text-gray-900">Await Contact via Email</h3>
                      <p className="text-gray-600 text-sm">
                        <strong>Within 48 hours</strong>, Vanilla Recovery team will contact you via email with recovery instructions and next steps.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <FiMessageCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">WhatsApp Communication</h3>
                      <p className="text-gray-600 text-sm">
                        You may also receive a message on WhatsApp from our team <strong>within 48 hours</strong>. Keep your phone accessible!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">📋</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">Track Your Request</h3>
                      <p className="text-gray-600 text-sm">
                        Use the button below to track your recovery request and chat with our team anytime.
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
                <Link href={`/track?tx_ref=${tx_ref}`} className="btn btn-primary flex-1 text-center">
                  Track Your Request
                </Link>
                <Link href="/" className="btn btn-secondary flex-1 text-center">
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* Verification Pending */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-4">
                  <FiCheckCircle className="w-12 h-12 text-yellow-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Payment Processing
                </h1>
                <p className="text-lg text-gray-600">
                  Your payment is being verified. This may take a few moments.
                </p>
              </div>

              {/* Info Card */}
              <div className="card mb-6 border-2 border-yellow-200 bg-yellow-50">
                <h3 className="font-semibold text-gray-900 mb-3">✅ Good News!</h3>
                <p className="text-gray-700 mb-4">
                  Based on your successful redirect from IntaSend, your payment was likely successful. 
                  Our team will verify it manually if automatic verification is delayed.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Reference:</span>
                    <span className="font-mono font-semibold">{tx_ref}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-yellow-600 font-semibold">⏳ Verifying</span>
                  </div>
                </div>
              </div>

              {/* What Happens Next */}
              <div className="card mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">What Happens Next?</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">1.</span>
                    <span>Check your email within 5-10 minutes for payment confirmation and recovery instructions</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">2.</span>
                    <span>Our team will review your case and start the recovery process</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-green-600 font-bold">3.</span>
                    <span>You'll receive a response within 24 hours</span>
                  </li>
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/track?tx_ref=${tx_ref}`} className="btn btn-primary flex-1 text-center">
                  Track Your Request
                </Link>
                <Link href="/" className="btn btn-secondary flex-1 text-center">
                  Return to Home
                </Link>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                If you don't receive an email within 30 minutes, please contact support with your transaction reference.
              </p>
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
