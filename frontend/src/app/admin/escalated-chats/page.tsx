'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiChevronLeft, FiSend, FiMessageSquare, FiUser, FiClock } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ChatMessage {
  sender: string;
  message: string;
  timestamp: string;
}

interface ChatSession {
  sessionId: string;
  userId?: string;
  userEmail?: string;
  userPhone?: string;
  status: string;
  lastMessage: string;
  createdAt: string;
  messages: ChatMessage[];
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
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchSessions(token, true);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async (token: string, silent = false) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/chat/sessions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSessions(response.data.data || []);
      
      // Update selected session if it exists
      if (selectedSession) {
        const updated = response.data.data?.find((s: ChatSession) => s.sessionId === selectedSession.sessionId);
        if (updated) {
          setSelectedSession(updated);
        }
      }
    } catch (error) {
      if (!silent) {
        toast.error('Failed to load chat sessions');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedSession) {
      toast.error('Please enter a message');
      return;
    }

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
      fetchSessions(token!, true);
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleMarkResolved = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `${API_URL}/api/admin/chat/resolve/${sessionId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Chat marked as resolved!');
      fetchSessions(token!);
      setSelectedSession(null);
    } catch (error) {
      toast.error('Failed to resolve chat');
      console.error(error);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Escalated Chats</h1>
              <p className="text-sm text-gray-600">Real-time customer support conversations</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary-600">{sessions.length}</p>
              <p className="text-xs text-gray-600">Active Chats</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading chats...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Sessions List */}
            <div className="lg:col-span-1">
              <div className="card sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    Conversations
                  </h3>
                  <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {sessions.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {sessions.length === 0 ? (
                    <div className="text-center py-12">
                      <FiMessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No escalated chats</p>
                      <p className="text-sm text-gray-400 mt-1">Chats will appear here when customers need help</p>
                    </div>
                  ) : (
                    sessions.map((session) => (
                      <button
                        key={session.sessionId}
                        onClick={() => setSelectedSession(session)}
                        className={`w-full text-left p-4 rounded-lg transition-all ${
                          selectedSession?.sessionId === session.sessionId
                            ? 'bg-primary-100 border-2 border-primary-600 shadow-md'
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                              {session.userEmail ? session.userEmail[0].toUpperCase() : '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {session.userEmail || session.userPhone || 'Anonymous'}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center space-x-1">
                                <FiClock className="w-3 h-3" />
                                <span>{new Date(session.createdAt).toLocaleTimeString()}</span>
                              </p>
                            </div>
                          </div>
                          {session.status === 'escalated' && (
                            <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                              New
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-2">
                          💬 {session.lastMessage}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-2">
              {selectedSession ? (
                <div className="card flex flex-col" style={{ height: '700px' }}>
                  {/* Chat Header */}
                  <div className="border-b pb-4 mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
                        <FiUser />
                        <span>{selectedSession.userEmail || selectedSession.userPhone || 'Anonymous User'}</span>
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Session: {selectedSession.sessionId.substring(0, 25)}...
                      </p>
                    </div>
                    <button
                      onClick={() => handleMarkResolved(selectedSession.sessionId)}
                      className="btn btn-secondary text-sm"
                    >
                      ✓ Mark Resolved
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 space-y-4 mb-4 overflow-y-auto px-2">
                    {selectedSession.messages && selectedSession.messages.length > 0 ? (
                      selectedSession.messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                              msg.sender === 'admin'
                                ? 'bg-primary-600 text-white rounded-br-none'
                                : 'bg-gray-200 text-gray-900 rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                            <p className={`text-xs mt-2 ${msg.sender === 'admin' ? 'text-primary-100' : 'text-gray-500'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString()} 
                              {msg.sender === 'admin' && ' • You'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="border-t pt-4 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-lg">
                    <div className="flex space-x-3">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your reply... (Press Enter to send, Shift+Enter for new line)"
                        className="input flex-1 resize-none"
                        rows={3}
                        disabled={sending}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={sending || !message.trim()}
                        className="btn btn-primary self-end px-6"
                      >
                        <FiSend className="inline mr-2" />
                        {sending ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💡 Tip: Customer will receive your message in real-time through the chat widget
                    </p>
                  </div>
                </div>
              ) : (
                <div className="card h-[700px] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FiMessageSquare className="w-20 h-20 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-semibold">Select a chat to view conversation</p>
                    <p className="text-sm mt-2">Choose from the list on the left</p>
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
