'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiChevronLeft, FiSend, FiUser, FiMail, FiPhone, FiShield } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function generateStaticParams() {
  return [];
}

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
  const params = useParams();
  const requestId = params.id as string;
  
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
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
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_URL}/api/admin/requests/${requestId}/comment`,
        { text: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Message sent!');
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
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/api/admin/requests/${requestId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated!');
      fetchRequestDetails(token!);
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Request Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info Card */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <FiUser className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">{request.user.name}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiMail className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900">{request.user.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FiPhone className="w-5 h-5 text-primary-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{request.user.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
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
              <h3 className="text-lg font-bold text-gray-900 mb-4">Request Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900">{request.description || 'No description provided'}</p>
                </div>
                
                {request.accountInfo && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Account Information</p>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {JSON.stringify(request.accountInfo, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Transaction Reference</p>
                    <p className="font-mono text-sm text-gray-900">{request.txRef}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tier</p>
                    <p className="font-semibold text-primary-600 capitalize">{request.tier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created At</p>
                    <p className="text-sm text-gray-900">
                      {new Date(request.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Send Message to Customer</h3>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="input flex-1"
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={sending || !message.trim()}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <FiSend />
                  <span>{sending ? 'Sending...' : 'Send'}</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Message will be sent via email to {request.user.email}
              </p>
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Status</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleUpdateStatus('in_progress')}
                  className={`w-full btn ${request.status === 'IN_PROGRESS' ? 'btn-primary' : 'btn-secondary'}`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleUpdateStatus('resolved')}
                  className={`w-full btn ${request.status === 'RESOLVED' ? 'bg-green-600 text-white hover:bg-green-700' : 'btn-secondary'}`}
                >
                  Resolved
                </button>
                <button
                  onClick={() => handleUpdateStatus('failed')}
                  className={`w-full btn ${request.status === 'FAILED' ? 'bg-red-600 text-white hover:bg-red-700' : 'btn-secondary'}`}
                >
                  Failed
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <a
                  href={`mailto:${request.user.email}`}
                  className="btn btn-secondary w-full text-left"
                >
                  <FiMail className="inline mr-2" />
                  Email Customer
                </a>
                <a
                  href={`tel:${request.user.phone}`}
                  className="btn btn-secondary w-full text-left"
                >
                  <FiPhone className="inline mr-2" />
                  Call Customer
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
