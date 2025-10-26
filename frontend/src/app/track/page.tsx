'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FiClock, FiCheckCircle, FiXCircle, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Request {
  id: string;
  platform: string;
  description: string;
  status: string;
  paymentStatus: string;
  txRef: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface Note {
  id: string;
  text: string;
  createdAt: string;
  user: {
    name: string;
  };
}

function TrackRequestContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const txRef = searchParams.get('tx_ref');
  
  const [request, setRequest] = useState<Request | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (txRef) {
      fetchRequestDetails();
    } else {
      toast.error('Transaction reference required');
      setLoading(false);
    }
  }, [txRef]);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/requests/track/${txRef}`);
      setRequest(response.data.data.request);
      setNotes(response.data.data.notes || []);
    } catch (error: any) {
      console.error('Error fetching request:', error);
      toast.error(error.response?.data?.message || 'Failed to load request details');
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
      await axios.post(
        `${API_URL}/api/requests/${request?.id}/message`,
        { text: message }
      );
      toast.success('Message sent to our team!');
      setMessage('');
      fetchRequestDetails(); // Refresh to show new note
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'RESOLVED':
        return <FiCheckCircle className="w-6 h-6 text-green-600" />;
      case 'FAILED':
        return <FiXCircle className="w-6 h-6 text-red-600" />;
      case 'IN_PROGRESS':
        return <FiClock className="w-6 h-6 text-yellow-600" />;
      default:
        return <FiAlertCircle className="w-6 h-6 text-blue-600" />;
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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your request details...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!request) {
    return (
      <>
        <Navbar />
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <FiXCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Not Found</h1>
            <p className="text-gray-600 mb-6">
              We couldn't find a request with this transaction reference.
            </p>
            <button onClick={() => router.push('/')} className="btn btn-primary">
              Return to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="pt-24 pb-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Track Your Recovery Request
            </h1>
            <p className="text-gray-600">
              Reference: <span className="font-mono font-semibold">{request.txRef}</span>
            </p>
          </div>

          {/* Status Card */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Current Status</h2>
              {getStatusIcon(request.status)}
            </div>
            <div className={`p-6 rounded-lg border-2 ${getStatusColor(request.status)}`}>
              <h3 className="text-xl font-bold mb-2">
                {request.status.replace('_', ' ')}
              </h3>
              <p className="text-sm">
                {request.status === 'NEW' && 'Your request has been received and is waiting to be reviewed.'}
                {request.status === 'IN_PROGRESS' && 'Our team is actively working on your case.'}
                {request.status === 'RESOLVED' && 'Your account recovery has been completed!'}
                {request.status === 'FAILED' && 'Unfortunately, we were unable to recover your account.'}
              </p>
            </div>
          </div>

          {/* Request Details */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Request Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Platform:</span>
                <span className="font-semibold capitalize">{request.platform.toLowerCase()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Submitted:</span>
                <span className="font-semibold">{new Date(request.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Payment Status:</span>
                <span className={`font-semibold ${request.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {request.paymentStatus}
                </span>
              </div>
              {request.description && (
                <div className="pt-2">
                  <p className="text-gray-600 mb-1">Description:</p>
                  <p className="text-gray-900">{request.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FiMessageSquare />
              <span>Conversation</span>
            </h2>
            
            {/* Chat Container */}
            <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto space-y-4">
              {notes && notes.length > 0 ? (
                notes.map((note) => {
                  // Determine if message is from admin (team) or customer
                  const isFromAdmin = note.user.name !== request.user.name;
                  
                  return (
                    <div
                      key={note.id}
                      className={`flex ${isFromAdmin ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                          isFromAdmin
                            ? 'bg-white border border-gray-200'
                            : 'bg-primary-600 text-white'
                        }`}
                      >
                        {isFromAdmin && (
                          <p className="text-xs font-semibold text-primary-600 mb-1">
                            {note.user.name}
                          </p>
                        )}
                        <p className={`text-sm ${isFromAdmin ? 'text-gray-900' : 'text-white'}`}>
                          {note.text}
                        </p>
                        <p className={`text-xs mt-2 ${isFromAdmin ? 'text-gray-500' : 'text-primary-100'}`}>
                          {new Date(note.createdAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <FiMessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
            </div>
          </div>

          {/* Send Message */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <FiMessageSquare />
              <span>Send a Message</span>
            </h2>
            <div className="flex space-x-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 input min-h-[60px] resize-none"
                disabled={sending}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={sending || !message.trim()}
                className="btn btn-primary px-6"
                style={{ alignSelf: 'flex-end' }}
              >
                {sending ? '...' : 'Send'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Press Enter to send, Shift+Enter for new line
            </p>
          </div>

          {/* Support Info */}
          <div className="card mt-6 bg-yellow-50 border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-2">Need Immediate Help?</h3>
            <p className="text-sm text-gray-700">
              Email us at: <a href="mailto:support@vanillarecoveryhub.com" className="text-primary-600 font-semibold">support@vanillarecoveryhub.com</a>
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Reference your transaction ID: <span className="font-mono font-semibold">{request.txRef}</span>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function TrackRequestPage() {
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
      <TrackRequestContent />
    </Suspense>
  );
}
