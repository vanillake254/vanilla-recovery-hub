'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiChevronLeft, FiSend, FiMessageSquare } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ChatSession {
  sessionId: string;
  userId?: string;
  userEmail?: string;
  status: string;
  lastMessage: string;
  createdAt: string;
  messages: Array<{
    sender: string;
    message: string;
    timestamp: string;
  }>;
}

export default function EscalatedChatsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSessions(token);
  }, []);

  const fetchSessions = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/chat/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data.data);
    } catch (error) {
      toast.error('Failed to load chat sessions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedSession) return;

    setSending(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_URL}/api/admin/chat/reply`,
        {
          sessionId: selectedSession.sessionId,
          message: message.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Message sent!');
      setMessage('');
      fetchSessions(token!);
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/admin')}
            className="text-primary-600 hover:text-primary-700 flex items-center space-x-2 mb-2"
          >
            <FiChevronLeft />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Escalated Chats</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sessions List */}
            <div className="lg:col-span-1">
              <div className="card">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Active Chats ({sessions.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {sessions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No escalated chats</p>
                  ) : (
                    sessions.map((session) => (
                      <button
                        key={session.sessionId}
                        onClick={() => setSelectedSession(session)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedSession?.sessionId === session.sessionId
                            ? 'bg-primary-100 border-2 border-primary-600'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {session.userEmail || 'Anonymous'}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {session.lastMessage}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(session.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {session.status === 'escalated' && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2">
              {selectedSession ? (
                <div className="card h-full flex flex-col">
                  {/* Chat Header */}
                  <div className="border-b pb-4 mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {selectedSession.userEmail || 'Anonymous User'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Session: {selectedSession.sessionId.substring(0, 20)}...
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 space-y-4 mb-4 max-h-96 overflow-y-auto">
                    {selectedSession.messages && selectedSession.messages.length > 0 ? (
                      selectedSession.messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.sender === 'admin'
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'admin' ? 'text-primary-100' : 'text-gray-500'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">No messages yet</p>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="border-t pt-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your reply..."
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
                  </div>
                </div>
              ) : (
                <div className="card h-96 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FiMessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>Select a chat session to view conversation</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
