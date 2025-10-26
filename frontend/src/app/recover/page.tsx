'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiCheck, FiShield, FiSearch, FiAlertCircle } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function RecoverPageContent() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState<'basic' | 'premium'>('basic');
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');
  
  // New customer form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    platform: '',
    description: '',
    hasEmailAccess: '',
  });

  // Existing customer lookup
  const [lookupIdentifier, setLookupIdentifier] = useState('');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupLoading, setLookupLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const plans = {
    basic: {
      name: 'Basic Recovery',
      price: 1500,
      features: [
        'Email guidance & step-by-step instructions',
        'Chat support for questions',
        'Security checklist PDF',
        'Platform-specific recovery guide',
        '24-hour response time'
      ]
    },
    premium: {
      name: 'Premium Recovery',
      price: 3000,
      features: [
        'Everything in Basic, PLUS:',
        'Priority 12-hour response',
        'Done-for-you assistance (with consent)',
        '2FA setup help',
        '7-day follow-up support',
        'Direct phone support'
      ]
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLookup = async () => {
    if (!lookupIdentifier.trim()) {
      toast.error('Please enter an email or phone number');
      return;
    }

    setLookupLoading(true);
    setLookupResult(null);

    try {
      const response = await axios.get(`${API_URL}/api/payments/check-access/${lookupIdentifier}`);
      
      if (response.data.hasPaidAccess) {
        setLookupResult({
          found: true,
          ...response.data
        });
        toast.success('Payment record found!');
      } else {
        setLookupResult({
          found: false,
          message: 'Payment record not found. Issue might be solved or subscription expired.'
        });
        toast.error('No active payment found');
      }
    } catch (error) {
      setLookupResult({
        found: false,
        message: 'Payment record not found. Issue might be solved or subscription expired.'
      });
      toast.error('No payment record found');
    } finally {
      setLookupLoading(false);
    }
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

      const { requestId } = requestResponse.data.data;

      toast.success('Request created! Initiating payment...');

      // Determine amount based on selected tier
      const amount = selectedTier === 'premium' ? 3000 : 1500;

      // Initiate payment
      const paymentResponse = await axios.post(`${API_URL}/api/payments/initiate`, {
        requestId,
        amount,
        tier: selectedTier,
      });

      const { paymentLink } = paymentResponse.data.data;

      // Store user info for chat access after payment
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userPhone', formData.phone);
      localStorage.setItem('userPlatform', formData.platform);

      toast.success('Redirecting to payment...');

      // Add small delay to ensure storage is saved, then redirect
      setTimeout(() => {
        if (paymentLink) {
          window.location.href = paymentLink;
        } else {
          toast.error('Payment link not received. Please try again.');
          setLoading(false);
        }
      }, 500);
    } catch (error: any) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to process payment. Please try again.';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          
          {/* Top Section - Logo & Description (1/4 of page) */}
          <div className="mb-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 512 512" className="w-16 h-16">
                  <path d="M256 80 L400 140 L400 280 Q400 360, 256 450 Q112 360, 112 280 L112 140 Z" 
                        fill="#FFFFFF" 
                        opacity="0.95"/>
                  <path d="M180 260 L230 310 L340 180" 
                        fill="none" 
                        stroke="#7C3AED" 
                        strokeWidth="24" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"/>
                  <circle cx="230" cy="310" r="12" fill="#7C3AED"/>
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Vanilla Recovery Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional account recovery services. Get your hacked or locked social media and email accounts back quickly and securely.
            </p>
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span className="flex items-center">
                <FiShield className="w-4 h-4 mr-2 text-green-600" />
                500+ Accounts Recovered
              </span>
              <span className="flex items-center">
                <FiCheck className="w-4 h-4 mr-2 text-green-600" />
                85% Success Rate
              </span>
            </div>
          </div>

          {/* Main Content (3/4 of page) */}
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Side - Plan Selection */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
                
                {/* Basic Plan */}
                <div 
                  onClick={() => setSelectedTier('basic')}
                  className={`card mb-4 cursor-pointer transition-all ${
                    selectedTier === 'basic' 
                      ? 'border-2 border-primary-600 bg-primary-50' 
                      : 'border border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Basic Recovery</h3>
                      <p className="text-sm text-gray-600">Email guidance + Chat support</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary-600">KES 1,500</div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plans.basic.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <FiCheck className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedTier === 'basic' && (
                    <div className="mt-4 pt-4 border-t border-primary-200">
                      <span className="text-sm font-semibold text-primary-700">✓ Selected</span>
                    </div>
                  )}
                </div>

                {/* Premium Plan */}
                <div 
                  onClick={() => setSelectedTier('premium')}
                  className={`card cursor-pointer transition-all ${
                    selectedTier === 'premium' 
                      ? 'border-2 border-primary-600 bg-primary-50' 
                      : 'border border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Premium Recovery</h3>
                      <p className="text-sm text-gray-600">Done-for-you + Priority support</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary-600">KES 3,000</div>
                      <span className="text-xs text-gray-500">Best Value</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plans.premium.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <FiCheck className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  {selectedTier === 'premium' && (
                    <div className="mt-4 pt-4 border-t border-primary-200">
                      <span className="text-sm font-semibold text-primary-700">✓ Selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Forms */}
            <div className="lg:col-span-2">
              
              {/* Tabs */}
              <div className="flex space-x-4 mb-6 border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('new')}
                  className={`pb-4 px-2 font-semibold transition-colors ${
                    activeTab === 'new'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  New Customer
                </button>
                <button
                  onClick={() => setActiveTab('existing')}
                  className={`pb-4 px-2 font-semibold transition-colors ${
                    activeTab === 'existing'
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Existing Customer
                </button>
              </div>

              {/* New Customer Form */}
              {activeTab === 'new' && (
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Start Your Recovery</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
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
                            className="input"
                            placeholder="+254712345678 or 0712345678"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Platform *
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
                            <option value="twitter">Twitter/X</option>
                            <option value="snapchat">Snapchat</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="telegram">Telegram</option>
                            <option value="yahoo">Yahoo Mail</option>
                            <option value="outlook">Outlook/Hotmail</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Describe the Issue *
                          </label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            className="input"
                            placeholder="Describe what happened to your account (e.g., hacked, locked out, password changed, etc.)"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Do you still have access to your recovery email/phone? *
                          </label>
                          <div className="flex space-x-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="hasEmailAccess"
                                value="yes"
                                checked={formData.hasEmailAccess === 'yes'}
                                onChange={handleChange}
                                required
                                className="mr-2"
                              />
                              <span className="text-sm">Yes</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="hasEmailAccess"
                                value="no"
                                checked={formData.hasEmailAccess === 'no'}
                                onChange={handleChange}
                                required
                                className="mr-2"
                              />
                              <span className="text-sm">No</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Selected Plan Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900">Selected Plan:</span>
                        <span className="text-primary-600 font-bold">{plans[selectedTier].name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">Total Amount:</span>
                        <span className="text-2xl font-bold text-primary-600">KES {plans[selectedTier].price.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary w-full text-lg py-4"
                    >
                      {loading ? 'Processing...' : `Proceed to Payment (KES ${plans[selectedTier].price.toLocaleString()})`}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      By proceeding, you agree to our Terms of Service and Privacy Policy.
                      Payment is processed securely via Flutterwave.
                    </p>
                  </form>
                </div>
              )}

              {/* Existing Customer Lookup */}
              {activeTab === 'existing' && (
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Recovery Status</h2>
                  <p className="text-gray-600 mb-6">
                    Enter the email or phone number you used when making payment to check your recovery status.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email or Phone Number
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={lookupIdentifier}
                          onChange={(e) => setLookupIdentifier(e.target.value)}
                          className="input flex-1"
                          placeholder="Enter email or phone number"
                        />
                        <button
                          onClick={handleLookup}
                          disabled={lookupLoading}
                          className="btn btn-primary"
                        >
                          <FiSearch className="w-5 h-5 mr-2" />
                          {lookupLoading ? 'Searching...' : 'Search'}
                        </button>
                      </div>
                    </div>

                    {/* Lookup Result */}
                    {lookupResult && (
                      <div className={`p-6 rounded-lg border-2 ${
                        lookupResult.found 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-yellow-50 border-yellow-200'
                      }`}>
                        {lookupResult.found ? (
                          <div>
                            <div className="flex items-center mb-4">
                              <FiCheck className="w-6 h-6 text-green-600 mr-2" />
                              <h3 className="text-lg font-bold text-green-900">Payment Record Found!</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-700">Plan:</span>
                                <span className="font-semibold text-gray-900">{lookupResult.tier?.toUpperCase()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Platform:</span>
                                <span className="font-semibold text-gray-900">{lookupResult.platform?.toUpperCase()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Payment Date:</span>
                                <span className="font-semibold text-gray-900">
                                  {new Date(lookupResult.paymentDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-700">Expires:</span>
                                <span className="font-semibold text-gray-900">
                                  {new Date(lookupResult.expiresAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-green-200">
                              <p className="text-sm text-green-800">
                                ✅ Your premium chat support is active! Open the chat widget to get help from our team.
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center mb-4">
                              <FiAlertCircle className="w-6 h-6 text-yellow-600 mr-2" />
                              <h3 className="text-lg font-bold text-yellow-900">No Active Payment Found</h3>
                            </div>
                            <p className="text-sm text-yellow-800 mb-4">
                              {lookupResult.message}
                            </p>
                            <button
                              onClick={() => setActiveTab('new')}
                              className="btn btn-primary w-full"
                            >
                              Start New Recovery
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
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
