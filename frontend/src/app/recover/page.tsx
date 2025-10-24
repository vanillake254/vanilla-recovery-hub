'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiAlertCircle, FiCheck } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function RecoverPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tier = searchParams.get('tier') || 'basic';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    platform: '',
    description: '',
    hasEmailAccess: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create recovery request
      const requestResponse = await axios.post(`${API_URL}/api/requests/create`, {
        ...formData,
        hasEmailAccess: formData.hasEmailAccess === 'yes',
      });

      const { requestId, tx_ref } = requestResponse.data.data;

      toast.success('Request created! Initiating payment...');

      // Determine amount based on tier
      const amount = tier === 'premium' ? 3000 : 1500;

      // Initiate payment
      const paymentResponse = await axios.post(`${API_URL}/api/payments/initiate`, {
        requestId,
        amount,
        tier,
      });

      const { paymentLink } = paymentResponse.data.data;

      toast.success('Redirecting to payment...');

      // Redirect to payment page
      window.location.href = paymentLink;
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.error || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start Your Account Recovery
            </h1>
            <p className="text-lg text-gray-600">
              Fill in the details below. After payment, you'll receive immediate access to recovery tools.
            </p>
          </div>

          {/* Selected Tier */}
          <div className="card mb-8 bg-primary-50 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {tier === 'premium' ? 'Premium Recovery' : 'Basic Recovery'}
                </h3>
                <p className="text-gray-600 text-sm">
                  {tier === 'premium' ? 'Priority support + Done-for-you assistance' : 'Email guidance + Chat support'}
                </p>
              </div>
              <div className="text-2xl font-bold text-primary-600">
                KES {tier === 'premium' ? '3,000' : '1,500'}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="card">
            {/* Personal Information */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Kenyan) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="^(\+254|254|0)[17]\d{8}$"
                    className="input"
                    placeholder="+254712345678 or 0712345678"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: +254XXXXXXXXX or 07XXXXXXXX
                  </p>
                </div>
              </div>
            </div>

            {/* Account Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Which platform? *
                  </label>
                  <select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    required
                    className="input"
                  >
                    <option value="">Select platform...</option>
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="gmail">Gmail</option>
                    <option value="tiktok">TikTok</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter/X</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Do you still have access to the recovery email or phone? *
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hasEmailAccess"
                        value="yes"
                        onChange={handleChange}
                        required
                        className="w-4 h-4 text-primary-600"
                      />
                      <span>Yes, I have access</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="hasEmailAccess"
                        value="no"
                        onChange={handleChange}
                        required
                        className="w-4 h-4 text-primary-600"
                      />
                      <span>No access</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe what happened *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input"
                    placeholder="Tell us what happened to your account. Be as detailed as possible (e.g., when did you lose access, have you received any suspicious messages, etc.)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 More details help us provide better guidance
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold mb-1">🔒 Security Notice</p>
                  <p>We will <strong>NEVER</strong> ask for your password. All recovery guidance respects your privacy and security.</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-4"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Proceed to Payment (KES ${tier === 'premium' ? '3,000' : '1,500'})`
              )}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>

          {/* What Happens Next */}
          <div className="card mt-8 bg-green-50 border-green-200">
            <h3 className="font-semibold text-gray-900 mb-3">✅ What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <FiCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span>You'll be redirected to secure payment (M-Pesa or Card)</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span>Receive instant email confirmation with recovery steps</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span>Access premium chatbot support immediately</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <span>Our team will reach out within 24 hours</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function RecoverPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <RecoverPageContent />
    </Suspense>
  );
}
