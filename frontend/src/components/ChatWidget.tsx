'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Message {
  from: 'user' | 'bot' | 'admin';
  text: string;
  ts: Date;
  suggestions?: string[];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session and check payment status
  useEffect(() => {
    const storedSession = localStorage.getItem('chatSessionId');
    if (storedSession) {
      setSessionId(storedSession);
      loadSession(storedSession);
    } else {
      const newSession = uuidv4();
      setSessionId(newSession);
      localStorage.setItem('chatSessionId', newSession);
    }

    // Check payment status
    const checkPaymentStatus = async () => {
      const email = localStorage.getItem('userEmail');
      const phone = localStorage.getItem('userPhone');
      if (email || phone) {
        try {
          const response = await axios.get(`${API_URL}/api/payments/check-access/${email || phone}`);
          if (response.data.hasPaidAccess) {
            setIsPaidUser(true);
            setUserEmail(email || '');
          }
        } catch (error) {
          console.error('Failed to check payment status:', error);
        }
      }
    };
    checkPaymentStatus();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadSession = async (sid: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/chat/session/${sid}`);
      if (response.data.data.messages) {
        setMessages(response.data.data.messages);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  const sendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || loading) return;

    // Handle special commands
    if (messageText === 'Start Recovery Process') {
      window.location.href = '/recover';
      return;
    }

    const userMessage: Message = {
      from: 'user',
      text: messageText,
      ts: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/chat/send`, {
        sessionId,
        message: messageText,
        context: {}, // Add context as needed
      });

      const { reply, suggestions } = response.data.data;

      const botMessage: Message = {
        from: 'bot',
        text: reply,
        ts: new Date(),
        suggestions,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        from: 'bot',
        text: "Sorry, I'm having trouble connecting. Please try again or contact support@vanillarecoveryhub.com",
        ts: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // Send welcome message if opening for the first time
    if (!isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        from: 'bot',
        text: "👋 Hi! I'm Vanilla AI Bot, your account recovery assistant. I'm here to help you recover your hacked or locked account. Which platform do you need help with?",
        ts: new Date(),
        suggestions: [
          "My Facebook is hacked",
          "I need help with Instagram",
          "Gmail recovery",
          "How much does it cost?"
        ],
      };
      setMessages([welcomeMessage]);
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-all hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <FiMessageCircle size={28} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            1
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-slide-up">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                  <svg viewBox="0 0 512 512" className="w-full h-full">
                    <circle cx="256" cy="256" r="256" fill="#7C3AED"/>
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
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-primary-600"></div>
              </div>
              <div>
                <h3 className="font-semibold">Vanilla AI Bot</h3>
                <p className="text-xs text-primary-100">Online • Instant replies</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-primary-700 p-2 rounded-full transition"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index}>
                <div
                  className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      msg.from === 'user'
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.from === 'user' ? 'text-primary-100' : 'text-gray-400'}`}>
                      {new Date(msg.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {/* Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-2">
                    {msg.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(suggestion)}
                        className="text-xs bg-white border border-primary-300 text-primary-700 px-3 py-1.5 rounded-full hover:bg-primary-50 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat With Support Button */}
          {!isPaidUser && (
            <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
              <button
                onClick={() => {
                  const paymentPrompt: Message = {
                    from: 'bot',
                    text: '💬 **Premium Chat Support**\n\nTo chat with our human support team, please complete payment first.\n\n✅ What you get:\n- Direct chat with recovery experts\n- Platform-specific recovery guides\n- Step-by-step instructions via email\n- Priority support\n\n**Price:** KES 1,500 (Basic) or KES 3,000 (Premium)\n\nClick below to start your recovery process!',
                    ts: new Date(),
                    suggestions: ['Start Recovery Process']
                  };
                  setMessages(prev => [...prev, paymentPrompt]);
                }}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition text-sm font-medium"
              >
                💬 Chat With Support Team
              </button>
            </div>
          )}

          {isPaidUser && (
            <div className="px-4 py-2 bg-green-50 border-t border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-green-700">✅ Premium Support Active</span>
                <button
                  onClick={() => {
                    const escalateMessage: Message = {
                      from: 'bot',
                      text: '🎯 Connecting you to our support team... A human agent will respond within 2 hours during business hours (Mon-Sat, 8 AM - 8 PM EAT).\n\nIn the meantime, what specific issue are you facing?',
                      ts: new Date()
                    };
                    setMessages(prev => [...prev, escalateMessage]);
                  }}
                  className="text-xs bg-green-600 text-white py-1 px-3 rounded-full hover:bg-green-700 transition"
                >
                  Request Human Agent
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim() || loading}
                className="bg-primary-600 text-white p-3 rounded-full hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend size={18} />
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              We never ask for passwords 🔒
            </p>
          </div>
        </div>
      )}
    </>
  );
}
