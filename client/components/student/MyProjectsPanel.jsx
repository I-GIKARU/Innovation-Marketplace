'use client'

import { useState, useEffect } from 'react'
import { Trash2, Edit, Eye, Download, ExternalLink, AlertCircle, CheckCircle, Clock, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProjects } from '@/hooks/useProjects'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api'

const MyProjectsPanel = () => {
  const { user, authFetch } = useAuth()
  const [myProjects, setMyProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, project: null })

  // Fetch student's own projects using cookie-based auth
  useEffect(() => {
    const loadMyProjects = async () => {
      if (user) {
        try {
          setLoading(true)
          const data = await authFetch('/projects/my')
          setMyProjects(data.projects || [])
        } catch (error) {
          console.error('Failed to load my projects:', error)
          setMyProjects([])
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    loadMyProjects()
  }, [user]) // Removed authFetch to prevent infinite loop

  // Handle project deletion using cookie-based auth
  const handleDeleteProject = async (projectId) => {
    setDeleting(true)
    try {
      await authFetch(`/projects/${projectId}`, {
        method: 'DELETE'
      })
      
      alert('Project and associated media deleted successfully')
      
      // Refresh the projects list
      const data = await authFetch('/projects/my')
      setMyProjects(data.projects || [])
      
    } catch (error) {
      console.error('Error deleting project:', error)
      alert(`Failed to delete project: ${error.message}`)
    } finally {
      setDeleting(false)
      setDeleteModal({ isOpen: false, project: null })
    }
  }

  // Handle project interactions (views, clicks, downloads)
  const handleProjectInteraction = async (projectId, type) => {
    try {
      if (type === 'click') {
        await authFetch(`/projects/${projectId}/click`, { method: 'POST' })
      } else if (type === 'download') {
        await authFetch(`/projects/${projectId}/download`, { method: 'POST' })
      }
    } catch (error) {
      console.error(`Error recording ${type}:`, error)
    }
  }

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      approved: 'bg-green-100 text-green-800 border border-green-300',
      rejected: 'bg-red-100 text-red-800 border border-red-300'
    }
    
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <X className="w-3 h-3" />
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {icons[status]}
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">My Projects</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading your projects...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">My Projects</h2>
        <div className="text-sm text-gray-500">
          {myProjects.length} project{myProjects.length !== 1 ? 's' : ''}
        </div>
      </div>

      {myProjects.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You haven't created any projects yet.</p>
          <p className="text-sm mt-2">Click the "+" button to create your first project!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myProjects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{project.title}</h3>
                    {getStatusBadge(project.status)}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 ml-4">
                  {project.demo_link && (
                    <a
                      href={project.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => handleProjectInteraction(project.id, 'click')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="View Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  
                  {project.github_link && (
                    <a
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer" 
                      onClick={() => handleProjectInteraction(project.id, 'click')}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                      title="View Source Code"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => handleProjectInteraction(project.id, 'download')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    title="Download Project"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit Project"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteModal({ isOpen: true, project })}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Project Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pt-3 border-t border-gray-100 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{project.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />
                  <span>{project.clicks || 0} clicks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>{project.downloads || 0} downloads</span>
                </div>
                <div>
                  {project.tech_stack && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {project.tech_stack.split(',')[0]}
                      {project.tech_stack.split(',').length > 1 && '...'}
                    </span>
                  )}
                </div>
              </div>

              {/* For Sale Badge */}
              {project.is_for_sale && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    For Sale
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Delete Project</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete "{deleteModal.project?.title}"? 
              This will permanently remove the project and all associated media files.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ isOpen: false, project: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deleteModal.project.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Project
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProjectsPanel
