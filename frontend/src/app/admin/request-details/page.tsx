'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiChevronLeft, FiSend, FiUser, FiMail, FiPhone, FiShield, FiClock } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Request {
  id: string;
  platform: string;
  status: string;
  tier: string;
  accountInfo: any;
  description: string;
  createdAt: string;
  txRef: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function RequestDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id');
  
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    if (!requestId) {
      router.push('/admin/requests');
      return;
    }
    fetchRequestDetails(token);
  }, [requestId]);

  const fetchRequestDetails = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequest(response.data.data);
    } catch (error) {
      toast.error('Failed to load request details');
      console.error(error);
      router.push('/admin/requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_URL}/api/admin/requests/${requestId}/comment`,
        { text: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Message sent to customer!');
      setMessage('');
      fetchRequestDetails(token!);
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/api/admin/requests/${requestId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated successfully!');
      fetchRequestDetails(token!);
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Request not found</p>
          <button onClick={() => router.push('/admin/requests')} className="btn btn-primary">
            Back to Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/admin/requests')}
            className="text-primary-600 hover:text-primary-700 flex items-center space-x-2 mb-2"
          >
            <FiChevronLeft />
            <span>Back to All Requests</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
              <p className="text-sm text-gray-600">ID: {request.id.substring(0, 15)}...</p>
            </div>
            <button
              onClick={() => router.push('/admin')}
              className="btn btn-secondary"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Request Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info Card */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FiUser className="text-primary-600" />
                <span>Customer Information</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FiUser className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-semibold text-gray-900">{request.user.name}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FiMail className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-semibold text-gray-900 text-sm break-all">{request.user.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FiPhone className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-semibold text-gray-900">{request.user.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FiShield className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Platform</p>
                    <p className="font-semibold text-gray-900 capitalize">{request.platform.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Details Card */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recovery Request Details</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-primary-600 pl-4">
                  <p className="text-sm text-gray-600 mb-1">Customer's Description</p>
                  <p className="text-gray-900">{request.description || 'No description provided by customer'}</p>
                </div>
                
                {request.accountInfo && Object.keys(request.accountInfo).length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2 font-semibold">Account Information Provided</p>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      {Object.entries(request.accountInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between border-b border-gray-200 pb-2 last:border-0">
                          <span className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                          <span className="text-sm font-semibold text-gray-900">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Transaction Ref</p>
                    <p className="font-mono text-xs text-gray-900 break-all">{request.txRef}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Service Tier</p>
                    <p className="font-semibold text-primary-600 capitalize">{request.tier}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Request Date</p>
                    <p className="text-sm text-gray-900">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Communication Section */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <FiSend className="text-primary-600" />
                <span>Send Message to Customer</span>
              </h3>
              <div className="space-y-3">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message to the customer here... They will receive it via email."
                  className="input min-h-[120px] resize-none"
                  disabled={sending}
                />
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    📧 Message will be sent to: <span className="font-semibold">{request.user.email}</span>
                  </p>
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !message.trim()}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <FiSend />
                    <span>{sending ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Current Status */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Current Status</h3>
              <div className={`p-4 rounded-lg text-center font-bold text-lg ${
                request.status === 'RESOLVED' ? 'bg-green-100 text-green-700' :
                request.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                request.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {request.status.replace('_', ' ')}
              </div>
            </div>

            {/* Update Status */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Update Status</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleUpdateStatus('IN_PROGRESS')}
                  disabled={updating || request.status === 'IN_PROGRESS'}
                  className={`w-full btn ${request.status === 'IN_PROGRESS' ? 'bg-yellow-600 text-white' : 'btn-secondary'}`}
                >
                  <FiClock className="inline mr-2" />
                  In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus('RESOLVED')}
                  disabled={updating || request.status === 'RESOLVED'}
                  className={`w-full btn ${request.status === 'RESOLVED' ? 'bg-green-600 text-white' : 'btn-secondary'}`}
                >
                  ✓ Mark as Resolved
                </button>
                <button
                  onClick={() => handleUpdateStatus('FAILED')}
                  disabled={updating || request.status === 'FAILED'}
                  className={`w-full btn ${request.status === 'FAILED' ? 'bg-red-600 text-white' : 'btn-secondary'}`}
                >
                  ✗ Mark as Failed
                </button>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Contact</h3>
              <div className="space-y-2">
                <a
                  href={`mailto:${request.user.email}?subject=Recovery Support - ${request.platform}`}
                  className="btn btn-secondary w-full text-left flex items-center space-x-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FiMail />
                  <span>Email Customer</span>
                </a>
                <a
                  href={`tel:${request.user.phone}`}
                  className="btn btn-secondary w-full text-left flex items-center space-x-2"
                >
                  <FiPhone />
                  <span>Call Customer</span>
                </a>
                <a
                  href={`https://wa.me/${request.user.phone.replace(/[^0-9]/g, '')}?text=Hi ${request.user.name}, regarding your ${request.platform} recovery request...`}
                  className="btn btn-secondary w-full text-left flex items-center space-x-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  💬 WhatsApp Customer
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
