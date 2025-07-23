"use client";

import React, { useState, useEffect } from "react";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Star,
  StarOff,
  Search, 
  Filter,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminProjectManagement = () => {
  const { user, authFetch, isAuthenticated, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionLoading, setActionLoading] = useState({});
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [rejectModal, setRejectModal] = useState({ show: false, project: null });
  const [rejectionReason, setRejectionReason] = useState('');

  // Fetch all projects using simplified endpoint
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
      const response = await fetch(`${apiBase}/projects?per_page=50`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data.projects || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 4000);
  };

  // Handle project approval using simplified PUT endpoint
  const handleApprove = async (projectId) => {
    if (authLoading || !isAuthenticated) {
      showNotification('error', 'Authentication required');
      return;
    }

    setActionLoading(prev => ({ ...prev, [`approve-${projectId}`]: true }));

    try {
      const data = await authFetch(`/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });
      
      // Update local state
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, status: 'approved' }
            : project
        )
      );

      showNotification('success', 'Project approved successfully!');
    } catch (err) {
      console.error('Error approving project:', err);
      showNotification('error', err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [`approve-${projectId}`]: false }));
    }
  };

  // Open rejection modal
  const openRejectModal = (project) => {
    setRejectModal({ show: true, project });
    setRejectionReason('');
  };

  // Close rejection modal
  const closeRejectModal = () => {
    setRejectModal({ show: false, project: null });
    setRejectionReason('');
  };

  // Handle project rejection with reason
  const handleRejectWithReason = async () => {
    if (authLoading || !isAuthenticated || !rejectModal.project) {
      showNotification('error', 'Authentication required');
      return;
    }

    const projectId = rejectModal.project.id;
    setActionLoading(prev => ({ ...prev, [`reject-${projectId}`]: true }));

    try {
      const data = await authFetch(`/admin/projects/${projectId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          reason: rejectionReason.trim() || 'Project rejected without specific reason'
        }),
      });
      
      // Update local state
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, status: 'rejected', rejection_reason: rejectionReason.trim() || 'Project rejected without specific reason' }
            : project
        )
      );

      showNotification('success', 'Project rejected successfully!');
      closeRejectModal();
    } catch (err) {
      console.error('Error rejecting project:', err);
      showNotification('error', err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [`reject-${projectId}`]: false }));
    }
  };

  // Handle feature/unfeature project
  const handleFeature = async (projectId, currentFeatured) => {
    if (authLoading || !isAuthenticated) {
      showNotification('error', 'Authentication required');
      return;
    }

    setActionLoading(prev => ({ ...prev, [`feature-${projectId}`]: true }));

    try {
      const data = await authFetch(`/admin/projects/${projectId}/feature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Update local state
      setProjects(prev => 
        prev.map(project => 
          project.id === projectId 
            ? { ...project, featured: !currentFeatured }
            : project
        )
      );

      showNotification('success', `Project ${!currentFeatured ? 'featured' : 'unfeatured'} successfully!`);
    } catch (err) {
      console.error('Error updating featured status:', err);
      showNotification('error', err.message);
    } finally {
      setActionLoading(prev => ({ ...prev, [`feature-${projectId}`]: false }));
    }
  };

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span className="font-medium">{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Project Management</h1>
          <p className="text-gray-600">Review and manage student projects</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {searchTerm || statusFilter !== 'all' ? "No projects found" : "No projects yet"}
          </h3>
          <p className="text-gray-500">
            {searchTerm || statusFilter !== 'all' 
              ? "Try adjusting your search or filter criteria"
              : "Projects will appear here once students submit them"
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              {/* Project Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {project.category?.name || 'No Category'}
                  </p>
                </div>
                {project.featured && (
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                )}
              </div>

              {/* Status Badge */}
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${getStatusColor(project.status)}`}>
                {getStatusIcon(project.status)}
                <span className="capitalize">{project.status}</span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Tech Stack */}
              {project.tech_stack && (
                <div className="mb-4">
                  <span className="text-xs font-medium text-gray-500">Tech Stack:</span>
                  <p className="text-sm text-gray-700">{project.tech_stack}</p>
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-4 text-xs text-gray-500 mb-4">
                <span>Views: {project.views || 0}</span>
                <span>Clicks: {project.clicks || 0}</span>
                <span>Downloads: {project.downloads || 0}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {project.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(project.id)}
                      disabled={authLoading || actionLoading[`approve-${project.id}`]}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title={authLoading ? "Authenticating..." : "Approve project"}
                    >
                      {authLoading || actionLoading[`approve-${project.id}`] ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve
                    </button>
                    <button
                      onClick={() => openRejectModal(project)}
                      disabled={authLoading}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title={authLoading ? "Authenticating..." : "Reject project"}
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
                
                {project.status === 'approved' && (
                  <button
                    onClick={() => handleFeature(project.id, project.featured)}
                    disabled={authLoading || actionLoading[`feature-${project.id}`]}
                    className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                      project.featured
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                    title={authLoading ? "Authenticating..." : project.featured ? "Unfeature project" : "Feature project"}
                  >
                    {authLoading || actionLoading[`feature-${project.id}`] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : project.featured ? (
                      <StarOff className="w-4 h-4" />
                    ) : (
                      <Star className="w-4 h-4" />
                    )}
                    {project.featured ? 'Unfeature' : 'Feature'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Rejection Modal */}
      {rejectModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Reject Project</h3>
                <p className="text-sm text-gray-500">Provide feedback to the student</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                You are about to reject "{rejectModal.project?.title}". Please provide a reason that will help the student understand what needs to be improved.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="rejection-reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for rejection *
              </label>
              <textarea
                id="rejection-reason"
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please explain what needs to be improved or why the project was rejected..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                This message will be visible to the student in their dashboard.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={actionLoading[`reject-${rejectModal.project?.id}`]}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectWithReason}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2 transition-colors"
                disabled={actionLoading[`reject-${rejectModal.project?.id}`] || !rejectionReason.trim()}
              >
                {actionLoading[`reject-${rejectModal.project?.id}`] ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Reject Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjectManagement;
