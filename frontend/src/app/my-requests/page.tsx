'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiCheckCircle, FiXCircle, FiAlertCircle, FiMessageSquare, FiChevronRight } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Request {
  id: string;
  platform: string;
  description: string;
  status: string;
  paymentStatus: string;
  txRef: string;
  createdAt: string;
  notes?: Array<{
    id: string;
    text: string;
    createdAt: string;
    user: {
      name: string;
    };
  }>;
}

interface UserData {
  name: string;
  email: string;
  phone: string;
}

function MyRequestsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const identifier = searchParams.get('identifier');
  
  const [requests, setRequests] = useState<Request[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (identifier) {
      fetchUserRequests();
    } else {
      toast.error('Email or phone required');
      router.push('/recover');
    }
  }, [identifier]);

  const fetchUserRequests = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/requests/user/${identifier}`);
      const data = response.data.data;
      
      setRequests(data.requests || []);
      setUser(data.user);
      
      if (data.requests.length === 0) {
        toast.error('No requests found');
      }
    } catch (error: any) {
      console.error('Error fetching requests:', error);
      toast.error(error.response?.data?.message || 'Failed to load requests');
      router.push('/recover');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RESOLVED':
        return <FiCheckCircle className="w-5 h-5 text-green-600" />;
      case 'FAILED':
        return <FiXCircle className="w-5 h-5 text-red-600" />;
      case 'IN_PROGRESS':
        return <FiClock className="w-5 h-5 text-yellow-600" />;
      default:
        return <FiAlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RESOLVED':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'FAILED':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    return status === 'PAID' 
      ? 'text-green-600 font-semibold' 
      : 'text-yellow-600 font-semibold';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-24 pb-20 px-4 bg-gray-50 min-h-screen">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your requests...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="pt-24 pb-20 px-4 bg-gray-50 min-h-screen">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              My Recovery Requests
            </h1>
            {user && (
              <p className="text-gray-600">
                Hello <span className="font-semibold">{user.name}</span> ({user.email})
              </p>
            )}
          </div>

          {/* Requests List */}
          {requests.length === 0 ? (
            <div className="card text-center py-12">
              <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Requests Found</h2>
              <p className="text-gray-600 mb-6">
                You haven't made any recovery requests yet.
              </p>
              <Link href="/recover" className="btn btn-primary">
                Start New Recovery
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {requests.map((request) => (
                <div key={request.id} className="card hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 capitalize">
                          {request.platform.toLowerCase()} Recovery
                        </h3>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="text-sm font-semibold">{request.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Submitted: {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Transaction Reference:</span>
                      <span className="font-mono text-sm font-semibold text-gray-900">{request.txRef}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={getPaymentStatusColor(request.paymentStatus)}>
                        {request.paymentStatus}
                      </span>
                    </div>
                    {request.description && (
                      <div className="pt-2">
                        <p className="text-sm text-gray-600 mb-1">Description:</p>
                        <p className="text-gray-900 text-sm">{request.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Messages Preview */}
                  {request.notes && request.notes.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2 text-blue-900 mb-2">
                        <FiMessageSquare className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          {request.notes.length} message{request.notes.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-sm text-blue-800">
                        Latest: {request.notes[0].text.substring(0, 80)}
                        {request.notes[0].text.length > 80 ? '...' : ''}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Link
                      href={`/track?tx_ref=${request.txRef}`}
                      className="flex-1 btn btn-primary flex items-center justify-center space-x-2"
                    >
                      <span>View Full Details & Chat</span>
                      <FiChevronRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Start New Request */}
          {requests.length > 0 && (
            <div className="mt-8 text-center">
              <Link href="/recover" className="btn btn-secondary">
                + Start New Recovery Request
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function MyRequestsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    }>
      <MyRequestsContent />
    </Suspense>
  );
}
