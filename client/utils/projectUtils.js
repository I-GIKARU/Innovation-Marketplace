import { CheckCircle, Clock, XCircle } from 'lucide-react';

export const getStatusBadge = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusIcon = (status) => {
  switch (status) {
    case 'approved':
      return <CheckCircle size={16} className="text-green-600" />;
    case 'pending':
      return <Clock size={16} className="text-yellow-600" />;
    case 'rejected':
      return <XCircle size={16} className="text-red-600" />;
    default:
      return <Clock size={16} className="text-gray-600" />;
  }
};

export const parseJsonSafely = (jsonString) => {
  try {
    return jsonString ? JSON.parse(jsonString) : [];
  } catch (error) {
    return [];
  }
};

export const filterProjects = (projects, filter) => {
  if (filter === 'all') return projects;
  return projects.filter(project => project.status === filter);
};
