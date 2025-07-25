"use client"
import React from 'react'
import { Eye, CheckCircle, XCircle, Trash2, Star } from 'lucide-react'
import LoadingSpinner from '../shared/LoadingSpinner'
import ProjectStatusIcon from './ProjectStatusIcon'
import { getStatusBadge } from '../shared/utils'

const ProjectTableRow = ({ 
  project, 
  onApprove, 
  onReject, 
  onDelete, 
  onToggleFeatured, 
  onViewDetails,
  updatingProject,
  deletingProject,
  togglingFeatured
}) => {
  return (
    <tr key={project.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img 
              className="h-10 w-10 rounded-lg object-cover" 
              src={project.thumbnail_url || '/placeholder-project.png'} 
              alt={project.title}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{project.title}</div>
            <div className="text-sm text-gray-500">{project.tech_stack}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {project.user_projects?.[0]?.user?.email || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <ProjectStatusIcon status={project.status} />
          <div className="ml-2">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(project.status)}`}>
              {project.status}
            </span>
            {project.status === 'rejected' && project.rejection_reason && (
              <div className="text-xs text-red-600 mt-1 max-w-xs truncate" title={project.rejection_reason}>
                Reason: {project.rejection_reason}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <button 
            onClick={() => onToggleFeatured(project.id, project.title, project.featured)}
            disabled={togglingFeatured === project.id}
            className={`flex items-center ${
              togglingFeatured === project.id 
                ? 'cursor-not-allowed' 
                : 'cursor-pointer hover:opacity-80'
            }`}
            title={
              togglingFeatured === project.id 
                ? 'Processing...' 
                : project.featured 
                  ? 'Remove from Featured' 
                  : 'Add to Featured'
            }
          >
            {togglingFeatured === project.id ? (
              <LoadingSpinner size={16} className="border-yellow-500 mr-2" />
            ) : (
              <Star 
                size={16} 
                className={`mr-2 ${
                  project.featured 
                    ? 'text-yellow-500 fill-current' 
                    : 'text-gray-400 hover:text-yellow-500'
                }`} 
              />
            )}
            <span className={`text-xs ${
              togglingFeatured === project.id 
                ? 'text-gray-400' 
                : project.featured 
                  ? 'text-yellow-600 font-medium' 
                  : 'text-gray-500 hover:text-yellow-600'
            }`}>
              {togglingFeatured === project.id 
                ? 'Processing...' 
                : project.featured 
                  ? 'Featured' 
                  : 'Not Featured'
              }
            </span>
          </button>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <div className="flex items-center">
          <Eye size={16} className="mr-1 text-gray-400" />
          {project.views || 0}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          {project.status === 'pending' && (
            <>
              <button 
                onClick={() => onApprove(project.id, 'approved')}
                disabled={updatingProject === project.id}
                className={`${
                  updatingProject === project.id 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-green-600 hover:text-green-900'
                }`}
                title={updatingProject === project.id ? 'Processing...' : 'Approve Project'}
              >
                {updatingProject === project.id ? (
                  <LoadingSpinner size={16} className="border-green-600" />
                ) : (
                  <CheckCircle size={16} />
                )}
              </button>
              <button 
                onClick={() => onReject(project)}
                disabled={updatingProject === project.id}
                className={`${
                  updatingProject === project.id 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-red-600 hover:text-red-900'
                }`}
                title={updatingProject === project.id ? 'Processing...' : 'Reject Project'}
              >
                {updatingProject === project.id ? (
                  <LoadingSpinner size={16} className="border-red-600" />
                ) : (
                  <XCircle size={16} />
                )}
              </button>
            </>
          )}
          <button 
            onClick={() => onDelete(project.id, project.title)}
            disabled={deletingProject === project.id}
            className={`${
              deletingProject === project.id 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-red-500 hover:text-red-700'
            }`}
            title={deletingProject === project.id ? 'Deleting...' : 'Delete Project'}
          >
            {deletingProject === project.id ? (
              <LoadingSpinner size={16} className="border-red-500" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
          <button 
            onClick={() => onViewDetails(project)}
            className="px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-900 border border-blue-600 hover:border-blue-900 rounded-md hover:bg-blue-50 transition-colors"
            title="View Project Details"
          >
            View
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ProjectTableRow
