'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiLogOut, FiUsers, FiDollarSign, FiCheckCircle, FiClock, FiMessageSquare } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Stats {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
  failedRequests: number;
  totalRevenue: number;
  escalatedChats: number;
}

interface Request {
  id: string;
  platform: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (!storedToken) {
      router.push('/admin/login');
      return;
    }
    setToken(storedToken);
    fetchDashboardData(storedToken);
  }, []);

  const fetchDashboardData = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/dashboard/stats`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      setStats(response.data.data.overview);
      setRecentRequests(response.data.data.recentRequests);
    } catch (error) {
      toast.error('Failed to load dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      NEW: 'bg-blue-100 text-blue-700',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
      RESOLVED: 'bg-green-100 text-green-700',
      FAILED: 'bg-red-100 text-red-700',
    };
    return badges[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Vanilla Recovery Hub</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Requests</p>
                <p className="text-3xl font-bold">{stats?.totalRequests || 0}</p>
              </div>
              <FiUsers className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold">KES {(stats?.totalRevenue || 0).toLocaleString()}</p>
              </div>
              <FiDollarSign className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Resolved</p>
                <p className="text-3xl font-bold">{stats?.resolvedRequests || 0}</p>
              </div>
              <FiCheckCircle className="w-12 h-12 text-purple-200" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Pending</p>
                <p className="text-3xl font-bold">{stats?.pendingRequests || 0}</p>
              </div>
              <FiClock className="w-12 h-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => router.push('/admin/requests')}
            className="card hover:shadow-lg transition-shadow text-left"
          >
            <FiUsers className="w-8 h-8 text-primary-600 mb-2" />
            <h3 className="font-semibold text-lg mb-1">View All Requests</h3>
            <p className="text-sm text-gray-600">Manage and track recovery requests</p>
          </button>

          <button
            onClick={() => router.push('/admin/chat')}
            className="card hover:shadow-lg transition-shadow text-left"
          >
            <FiMessageSquare className="w-8 h-8 text-primary-600 mb-2" />
            <h3 className="font-semibold text-lg mb-1">Escalated Chats</h3>
            <p className="text-sm text-gray-600">
              {stats?.escalatedChats || 0} chats need attention
            </p>
          </button>

          <button 
            onClick={() => router.push('/admin/bot-training')}
            className="card hover:shadow-lg transition-shadow text-left"
          >
            <FiMessageSquare className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-lg mb-1">Bot Training</h3>
            <p className="text-sm text-gray-600">Train Vanilla AI Bot</p>
          </button>
        </div>

        {/* Recent Requests Table */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Requests</h2>
            <button
              onClick={() => router.push('/admin/requests')}
              className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left text-sm text-gray-600">
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Platform</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request.id} className="border-b border-gray-100">
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-gray-900">{request.user.name}</p>
                        <p className="text-sm text-gray-500">{request.user.email}</p>
                        <p className="text-xs text-gray-400">{request.user.phone}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="capitalize font-medium text-gray-700">
                        {request.platform.toLowerCase()}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => router.push(`/admin/requests/${request.id}`)}
                        className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
