"use client"
import React, { useState, useEffect } from 'react'
import { Backpack, Search, Filter, BarChart3, TrendingUp, Users, Eye, Star } from 'lucide-react'
import ProjectTableRow from './ProjectTableRow'
import ProjectRejectionModal from './ProjectRejectionModal'
import ProjectDetailsModal from './ProjectDetailsModal'
import ProjectQA from '@/components/projects/ProjectQA'
import { apiCall } from '../shared/utils'

const ProjectsManagement = () => {
  const [projects, setProjects] = useState([])
  const [statusCounts, setStatusCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [updatingProject, setUpdatingProject] = useState(null)
  const [deletingProject, setDeletingProject] = useState(null)
  const [togglingFeatured, setTogglingFeatured] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Rejection modal state
  const [rejectModal, setRejectModal] = useState({ show: false, project: null })
  
  // Project details view state
  const [detailsView, setDetailsView] = useState({ 
    show: false, 
    project: null, 
    loading: false, 
    error: null 
  })
  
  // Project AI Q&A modal state
  const [qaModal, setQaModal] = useState({ 
    show: false, 
    project: null 
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await apiCall('/api/projects')
      setProjects(data.projects || [])
      setStatusCounts(data.status_counts || {})
      setLoading(false)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleStatusChange = async (projectId, newStatus) => {
    setUpdatingProject(projectId)
    try {
      const result = await apiCall(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      })
      
      const actionText = newStatus === 'approved' ? 'approved' : 'rejected'
      alert(`Project "${result.project?.title || 'Unknown'}" has been ${actionText} successfully!`)
      
      fetchProjects()
    } catch (err) {
      console.error('Error updating project status:', err)
      alert(`Failed to update project status: ${err.message}`)
    } finally {
      setUpdatingProject(null)
    }
  }

  const handleDeleteProject = async (projectId, projectTitle) => {
    if (!confirm(`Are you sure you want to delete the project "${projectTitle}"? This action cannot be undone.`)) {
      return
    }

    setDeletingProject(projectId)
    try {
      await apiCall(`/api/projects/${projectId}`, {
        method: 'DELETE',
      })

      alert(`Project "${projectTitle}" has been deleted successfully!`)
      fetchProjects()
    } catch (err) {
      console.error('Error deleting project:', err)
      alert(`Failed to delete project: ${err.message}`)
    } finally {
      setDeletingProject(null)
    }
  }

  const handleToggleFeatured = async (projectId, projectTitle, currentFeaturedStatus) => {
    setTogglingFeatured(projectId)
    try {
      const result = await apiCall(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({ featured: !currentFeaturedStatus }),
      })

      const actionText = result.project.featured ? 'featured' : 'unfeatured'
      alert(`Project "${projectTitle}" has been ${actionText} successfully!`)
      
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId 
            ? { ...project, featured: result.project.featured }
            : project
        )
      )
    } catch (err) {
      console.error('Error updating featured status:', err)
      alert(`Failed to update featured status: ${err.message}`)
    } finally {
      setTogglingFeatured(null)
    }
  }

  const openRejectModal = (project) => {
    setRejectModal({ show: true, project })
  }

  const closeRejectModal = () => {
    setRejectModal({ show: false, project: null })
  }

  const openQAModal = (project) => {
    setQaModal({ show: true, project })
  }

  const closeQAModal = () => {
    setQaModal({ show: false, project: null })
  }

  const handleRejectWithReason = async (rejectionReason) => {
    if (!rejectModal.project) return

    const projectId = rejectModal.project.id
    setUpdatingProject(projectId)

    try {
      const result = await apiCall(`/api/projects/${projectId}`, {
        method: 'PUT',
        body: JSON.stringify({ 
          status: 'rejected',
          rejection_reason: rejectionReason
        }),
      })
      
      alert(`Project "${rejectModal.project.title}" has been rejected successfully!`)
      fetchProjects()
      closeRejectModal()
    } catch (err) {
      console.error('Error rejecting project:', err)
      alert(`Failed to reject project: ${err.message}`)
    } finally {
      setUpdatingProject(null)
    }
  }

  const openDetailsView = async (project) => {
    console.log('🔍 Opening details view for project:', project.id)
    setDetailsView({ show: true, project: null, loading: true, error: null })
    console.log('📱 Set detailsView state - show: true, loading: true')
    
    try {
      console.log('🌐 Making API call to fetch project details...')
      const data = await apiCall(`/api/projects/${project.id}`)
      const projectData = data.project || data
      console.log('✅ API call successful, setting project data and loading: false')
      
      setDetailsView({ show: true, project: projectData, loading: false, error: null })
    } catch (err) {
      console.error('❌ Error fetching project details:', err)
      setDetailsView({ show: true, project: null, loading: false, error: err.message })
    }
  }

  const closeDetailsView = () => {
    setDetailsView({ show: false, project: null })
  }

  // Calculate statistics
  const totalProjects = projects.length
  const featuredProjects = projects.filter(p => p.featured).length
  const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0)
  const totalClicks = projects.reduce((sum, p) => sum + (p.clicks || 0), 0)

  const filteredProjects = projects.filter(project => {
    const matchesFilter = filter === 'all' || project.status === filter
    const matchesSearch = !searchTerm || 
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tech_stack?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Backpack className="mr-2" />
          Projects Management
        </h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Backpack className="mr-2" />
          Projects Management
        </h1>
        <div className="text-red-500 text-center py-8">
          <p>Error loading projects: {error}</p>
          <button 
            onClick={fetchProjects}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Backpack className="mr-2" />
          Projects Management
        </h1>
        
        <div className="flex space-x-2">
          {['all', 'pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {statusCounts[status] !== undefined && (
                <span className="ml-2 px-2 py-1 text-xs bg-white bg-opacity-20 rounded-full">
                  {status === 'all' ? totalProjects : statusCounts[status]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Projects</p>
              <p className="text-3xl font-bold">{totalProjects}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold">{statusCounts.approved || 0}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Pending Review</p>
              <p className="text-3xl font-bold">{statusCounts.pending || 0}</p>
            </div>
            <Users className="h-8 w-8 text-yellow-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Featured</p>
              <p className="text-3xl font-bold">{featuredProjects}</p>
            </div>
            <Star className="h-8 w-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Search and Metrics Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search projects by title, description, or tech stack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>{totalViews.toLocaleString()} total views</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>{totalClicks.toLocaleString()} total clicks</span>
            </div>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Backpack size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No projects found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <ProjectTableRow
                  key={project.id}
                  project={project}
                  onApprove={handleStatusChange}
                  onReject={openRejectModal}
                  onDelete={handleDeleteProject}
                  onToggleFeatured={handleToggleFeatured}
                  onViewDetails={openDetailsView}
                  onAskAI={openQAModal}
                  updatingProject={updatingProject}
                  deletingProject={deletingProject}
                  togglingFeatured={togglingFeatured}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <ProjectRejectionModal
        isOpen={rejectModal.show}
        onClose={closeRejectModal}
        project={rejectModal.project}
        onReject={handleRejectWithReason}
        isLoading={updatingProject === rejectModal.project?.id}
      />

      <ProjectDetailsModal
        isOpen={detailsView.show}
        project={detailsView.project}
        isLoading={detailsView.loading}
        error={detailsView.error}
        onClose={closeDetailsView}
        onAskAI={openQAModal}
      />

      <ProjectQA
        isOpen={qaModal.show}
        project={qaModal.project}
        onClose={closeQAModal}
      />
    </div>
  )
}

export default ProjectsManagement
