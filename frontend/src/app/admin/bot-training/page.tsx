'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiMessageSquare, FiSave } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Intent {
  name: string;
  patterns: string[];
  responses: string[];
  tags?: string[];
}

export default function BotTraining() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [intents, setIntents] = useState<Intent[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newIntent, setNewIntent] = useState({
    patterns: [''],
    responses: [''],
    name: '',
    tags: ['custom']
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchTrainingData(token);
  }, []);

  const fetchTrainingData = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/bot/training`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIntents(response.data.data.intents);
      setMetrics(response.data.data.metrics);
    } catch (error) {
      toast.error('Failed to load training data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPattern = () => {
    setNewIntent({
      ...newIntent,
      patterns: [...newIntent.patterns, '']
    });
  };

  const handleAddResponse = () => {
    setNewIntent({
      ...newIntent,
      responses: [...newIntent.responses, '']
    });
  };

  const handlePatternChange = (index: number, value: string) => {
    const updated = [...newIntent.patterns];
    updated[index] = value;
    setNewIntent({ ...newIntent, patterns: updated });
  };

  const handleResponseChange = (index: number, value: string) => {
    const updated = [...newIntent.responses];
    updated[index] = value;
    setNewIntent({ ...newIntent, responses: updated });
  };

  const handleRemovePattern = (index: number) => {
    if (newIntent.patterns.length > 1) {
      const updated = newIntent.patterns.filter((_, i) => i !== index);
      setNewIntent({ ...newIntent, patterns: updated });
    }
  };

  const handleRemoveResponse = (index: number) => {
    if (newIntent.responses.length > 1) {
      const updated = newIntent.responses.filter((_, i) => i !== index);
      setNewIntent({ ...newIntent, responses: updated });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const patterns = newIntent.patterns.filter(p => p.trim());
    const responses = newIntent.responses.filter(r => r.trim());

    if (patterns.length === 0 || responses.length === 0) {
      toast.error('Please add at least one pattern and one response');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_URL}/api/admin/bot/training`,
        {
          patterns,
          responses,
          name: newIntent.name || undefined,
          tags: newIntent.tags
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success('Training added successfully! Bot will learn from this.');
      setShowAddForm(false);
      setNewIntent({
        patterns: [''],
        responses: [''],
        name: '',
        tags: ['custom']
      });
      fetchTrainingData(token!);
    } catch (error) {
      toast.error('Failed to add training');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading training data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bot Training</h1>
        <p className="text-gray-600">
          Train Vanilla AI Bot to answer new questions. The bot will match similar questions automatically.
        </p>
      </div>

      {metrics && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Intents</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalIntents}</p>
              </div>
              <FiMessageSquare className="w-12 h-12 text-primary-600 opacity-20" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patterns</p>
                <p className="text-3xl font-bold text-gray-900">{metrics.totalPatterns}</p>
              </div>
              <FiMessageSquare className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-xl font-bold text-green-600">
                  {metrics.isInitialized ? 'Active' : 'Inactive'}
                </p>
              </div>
              <FiMessageSquare className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          {showAddForm ? 'Cancel' : 'Add New Training'}
        </button>
      </div>

      {showAddForm && (
        <div className="card mb-8 border-2 border-primary-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Training</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intent Name (Optional)
              </label>
              <input
                type="text"
                value={newIntent.name}
                onChange={(e) => setNewIntent({ ...newIntent, name: e.target.value })}
                className="input"
                placeholder="e.g., whatsapp_recovery"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to auto-generate
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patterns (Questions users might ask)
              </label>
              <div className="space-y-2">
                {newIntent.patterns.map((pattern, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={pattern}
                      onChange={(e) => handlePatternChange(index, e.target.value)}
                      className="input flex-1"
                      placeholder="e.g., how do i recover my whatsapp"
                      required
                    />
                    {newIntent.patterns.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePattern(index)}
                        className="btn btn-secondary"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddPattern}
                className="btn btn-secondary mt-2 text-sm"
              >
                <FiPlus className="w-4 h-4 mr-1" />
                Add Pattern
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Add multiple variations of the same question
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Responses (Bot answers)
              </label>
              <div className="space-y-2">
                {newIntent.responses.map((response, index) => (
                  <div key={index} className="flex space-x-2">
                    <textarea
                      value={response}
                      onChange={(e) => handleResponseChange(index, e.target.value)}
                      className="input flex-1"
                      rows={3}
                      placeholder="e.g., To recover WhatsApp, reinstall the app and verify with your phone number..."
                      required
                    />
                    {newIntent.responses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveResponse(index)}
                        className="btn btn-secondary"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddResponse}
                className="btn btn-secondary mt-2 text-sm"
              >
                <FiPlus className="w-4 h-4 mr-1" />
                Add Response
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Bot will randomly choose from these responses
              </p>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn btn-primary">
                <FiSave className="w-5 h-5 mr-2" />
                Save Training
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Existing Training Data</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {intents.map((intent, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{intent.name}</h4>
                {intent.tags && (
                  <div className="flex space-x-1">
                    {intent.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-sm space-y-2">
                <div>
                  <p className="text-gray-600 font-medium">Patterns ({intent.patterns.length}):</p>
                  <p className="text-gray-700">{intent.patterns.slice(0, 3).join(', ')}
                    {intent.patterns.length > 3 && ` +${intent.patterns.length - 3} more`}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 font-medium">Responses ({intent.responses.length}):</p>
                  <p className="text-gray-700">{intent.responses[0].substring(0, 100)}...</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
