'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Request {
  id: string;
  platform: string;
  status: string;
  createdAt: string;
  txRef: string;
  tier: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export default function AdminRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    platform: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchRequests(token);
  }, [page, filters]);

  const fetchRequests = async (token: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(filters.status && { status: filters.status }),
        ...(filters.paymentStatus && { paymentStatus: filters.paymentStatus }),
        ...(filters.platform && { platform: filters.platform }),
      });

      const response = await axios.get(`${API_URL}/api/admin/requests?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequests(response.data.data.requests);
      setTotalPages(response.data.data.pagination.pages);
    } catch (error) {
      toast.error('Failed to load requests');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setPage(1);
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/admin')}
                className="text-primary-600 hover:text-primary-700 flex items-center space-x-2 mb-2"
              >
                <FiChevronLeft />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">All Requests</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="card mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <FiFilter className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                name="paymentStatus"
                value={filters.paymentStatus}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                name="platform"
                value={filters.platform}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Platforms</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="gmail">Gmail</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="card">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No requests found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-sm text-gray-600">
                      <th className="pb-3 font-semibold">TX Ref</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Platform</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Tier</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4">
                          <span className="font-mono text-xs text-gray-600">
                            {request.txRef ? request.txRef.substring(0, 20) + '...' : 'N/A'}
                          </span>
                        </td>
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
                        <td className="py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 capitalize">
                            {request.tier || 'basic'}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-600">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => router.push(`/admin/request-details?id=${request.id}`)}
                            className="text-primary-600 hover:text-primary-700 font-semibold text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="btn btn-secondary flex items-center space-x-1 disabled:opacity-50"
                    >
                      <FiChevronLeft />
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="btn btn-secondary flex items-center space-x-1 disabled:opacity-50"
                    >
                      <span>Next</span>
                      <FiChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
