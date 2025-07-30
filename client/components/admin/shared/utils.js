import apiClient from '@/lib/apiClient';

// API utility functions
export const apiCall = async (url, options = {}) => {
  const { body, ...restOptions } = options;
  
  const config = {
    url,
    withCredentials: true,
    ...restOptions
  };

  // If body is provided, set it as data and ensure JSON headers
  if (body) {
    config.data = body;
    config.headers = {
      'Content-Type': 'application/json',
      ...config.headers
    };
  }

  const response = await apiClient(config);
  return response.data;
}

// Helper function to parse JSON strings safely
export const parseJsonSafely = (input) => {
  // If input is already an array or object, return it as is
  if (Array.isArray(input) || (typeof input === 'object' && input !== null)) {
    return input
  }
  
  // If input is a string, try to parse it as JSON
  if (typeof input === 'string') {
    try {
      return input ? JSON.parse(input) : []
    } catch (error) {
      return []
    }
  }
  
  // For any other input type, return empty array
  return []
}

// Status badge utility
export const getStatusBadge = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    case 'cancelled':
      return 'bg-gray-100 text-gray-800'
    case 'processing':
      return 'bg-purple-100 text-purple-800'
    case 'shipped':
      return 'bg-indigo-100 text-indigo-800'
    case 'delivered':
      return 'bg-emerald-100 text-emerald-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Date formatting utility
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString()
}

// Currency formatting utility
export const formatCurrency = (amount) => {
  return `KSh ${Number(amount).toLocaleString()}`
}
