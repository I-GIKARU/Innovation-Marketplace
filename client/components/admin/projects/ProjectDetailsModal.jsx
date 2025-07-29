"use client"
import React from 'react'
import {
  X, User, Calendar, Eye, ExternalLink, Download, Play, FileText,
  Archive, Star, DollarSign, Users, GitBranch, Mail, UserCheck,
  CheckCircle, XCircle, Clock, Tag, MousePointer, BarChart3
} from 'lucide-react'
import { parseJsonSafely, getStatusBadge, formatDate } from '../shared/utils'

const ProjectDetailsModal = ({
                               project,
                               isLoading,
                               error,
                               onClose,
                               isOpen
                             }) => {
  // Don't render if not open
  if (!isOpen) return null

  // Helper function to safely render values
  const renderValue = (value) => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'string' || typeof value === 'number') return value
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') {
      if (value.name) return value.name
      if (value.title) return value.title
      if (value.label) return value.label
      if (value.email) return value.email
      return JSON.stringify(value)
    }
    return String(value)
  }

  // Better date formatting function
  const formatProjectDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'N/A'
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'N/A'
    }
  }

  const InfoRow = ({ label, value, icon: Icon }) => (
      <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0">
        <div className="flex items-center min-w-0 flex-1">
          {Icon && <Icon size={14} className="text-gray-500 mr-2 flex-shrink-0" />}
          <span className="text-sm font-medium text-gray-700 truncate">{label}:</span>
        </div>
        <div className="text-sm text-gray-900 ml-4 flex-shrink-0 max-w-xs">
          {React.isValidElement(value) ? value : renderValue(value)}
        </div>
      </div>
  )

  const StatBadge = ({ icon: Icon, value, label, color = "blue" }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
      red: "bg-red-50 text-red-700 border-red-200"
    }

    return (
        <div className={`flex items-center px-3 py-2 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="mr-2 flex-shrink-0" size={16} />
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{value}</div>
            <div className="text-xs opacity-75 truncate">{label}</div>
          </div>
        </div>
    )
  }

  return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
            className="absolute inset-0 bg-gray-900 bg-opacity-30 backdrop-blur-sm transition-opacity"
            onClick={onClose}
        />

        {/* Modal */}
        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
                  <p className="text-sm text-gray-600">Complete project information</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {project && (
                    <>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(project.status)}`}>
                    {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                  </span>
                      {project.featured && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center">
                      <Star size={14} className="mr-1" />
                      Featured
                    </span>
                      )}
                    </>
                )}
                <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              {isLoading ? (
                  <div className="p-8">
                    <div className="animate-pulse space-y-6">
                      <div className="bg-gray-200 h-8 rounded w-3/4"></div>
                      <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="bg-gray-200 h-4 rounded"></div>
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-200 h-24 rounded"></div>
                        ))}
                      </div>
                    </div>
                  </div>
              ) : error ? (
                  <div className="p-8 text-center">
                    <XCircle size={48} className="mx-auto text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Project</h3>
                    <p className="text-gray-600">{error}</p>
                  </div>
              ) : !project ? (
                  <div className="p-8 text-center">
                    <Archive size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Not Found</h3>
                    <p className="text-gray-600">The requested project could not be found.</p>
                  </div>
              ) : (
                  <div className="p-6 space-y-6">

                    {/* Project Overview */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-1/3">
                          <img
                              src={project.thumbnail_url || '/placeholder-project.png'}
                              alt={project.title}
                              className="w-full h-48 object-cover rounded-lg shadow-md"
                          />
                        </div>
                        <div className="lg:w-2/3 space-y-4">
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
                            <p className="text-gray-700 leading-relaxed">{project.description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoRow label="Tech Stack" value={project.tech_stack || 'N/A'} icon={GitBranch} />
                            <InfoRow
                                label="Category"
                                value={project.category?.name || 'N/A'}
                                icon={Tag}
                            />
                            <InfoRow
                                label="Technical Mentor"
                                value={project.technical_mentor || 'Not Assigned'}
                                icon={User}
                            />
                            <InfoRow label="Created" value={formatProjectDate(project.created_at)} icon={Calendar} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                      <StatBadge icon={Eye} value={project.views || 0} label="Views" color="blue" />
                      <StatBadge icon={MousePointer} value={project.clicks || 0} label="Clicks" color="green" />
                      <StatBadge icon={Download} value={project.downloads || 0} label="Downloads" color="purple" />
                      <StatBadge
                          icon={project.status === 'approved' ? CheckCircle : project.status === 'rejected' ? XCircle : Clock}
                          value={project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Unknown'}
                          label="Status"
                          color={project.status === 'approved' ? 'green' : project.status === 'rejected' ? 'red' : 'orange'}
                      />
                      <StatBadge
                          icon={Star}
                          value={project.featured ? 'Yes' : 'No'}
                          label="Featured"
                          color={project.featured ? 'orange' : 'blue'}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                      {/* Left Column - Main Info */}
                      <div className="lg:col-span-2 space-y-6">

                        {/* Contributors */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Users size={18} className="mr-2 text-blue-600" />
                            Contributors & Team
                          </h3>

                          <div className="space-y-4">
                            {/* Student Info */}
                            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                <User size={16} className="mr-2" />
                                Student Information
                              </h4>
                              <div className="space-y-2">
                                <InfoRow
                                    label="Email"
                                    value={project.user_projects?.[0]?.user?.email || 'N/A'}
                                    icon={Mail}
                                />
                                <InfoRow
                                    label="Role"
                                    value={project.user_projects?.[0]?.interested_in || 'contributor'}
                                    icon={UserCheck}
                                />
                              </div>
                            </div>

                            {/* External Collaborators */}
                            {(() => {
                              const collaborators = parseJsonSafely(project.external_collaborators)
                              console.log('External Collaborators Debug:', {
                                raw: project.external_collaborators,
                                parsed: collaborators,
                                length: collaborators.length
                              })
                              return collaborators.length > 0
                            })() && (
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                    <Users size={16} className="mr-2" />
                                    External Collaborators ({parseJsonSafely(project.external_collaborators).length})
                                  </h4>
                                  <div className="space-y-2">
                                    {parseJsonSafely(project.external_collaborators).map((collaborator, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                                          <div className="flex-1">
                                            <div className="font-medium text-gray-900">
                                              {collaborator.name || `Collaborator ${index + 1}`}
                                            </div>
                                            {collaborator.email && (
                                                <div className="text-sm text-gray-600 mt-1">
                                                  <Mail size={12} className="inline mr-1" />
                                                  {collaborator.email}
                                                </div>
                                            )}
                                            {collaborator.github && (
                                                <a
                                                    href={collaborator.github.startsWith('http') ? collaborator.github : `https://github.com/${collaborator.github}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center mt-1"
                                                >
                                                  <GitBranch size={14} className="mr-1" />
                                                  View GitHub Profile
                                                </a>
                                            )}
                                          </div>
                                        </div>
                                    ))}
                                  </div>
                                </div>
                            )}
                          </div>
                        </div>

                        {/* Project Files & Media */}
                        {(parseJsonSafely(project.pdf_urls).length > 0 ||
                            parseJsonSafely(project.video_urls).length > 0 ||
                            parseJsonSafely(project.zip_urls).length > 0) && (
                            <div className="bg-white rounded-lg border border-gray-200 p-5">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Archive size={18} className="mr-2 text-purple-600" />
                                Project Files & Media
                              </h3>

                              <div className="space-y-5">

                                {/* PDFs */}
                                {parseJsonSafely(project.pdf_urls).length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                        <FileText size={16} className="mr-2 text-green-600" />
                                        PDF Documents ({parseJsonSafely(project.pdf_urls).length})
                                      </h4>
                                      <div className="space-y-2">
                                        {parseJsonSafely(project.pdf_urls).slice(0, 3).map((pdfUrl, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                                              <div className="flex items-center">
                                                <FileText size={20} className="text-green-600 mr-3" />
                                                <span className="text-sm font-medium">PDF Document {index + 1}</span>
                                              </div>
                                              <a
                                                  href={pdfUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                                              >
                                                <Download size={14} className="mr-1" />
                                                Download
                                              </a>
                                            </div>
                                        ))}
                                        {parseJsonSafely(project.pdf_urls).length > 3 && (
                                            <p className="text-sm text-gray-500 text-center">
                                              +{parseJsonSafely(project.pdf_urls).length - 3} more documents
                                            </p>
                                        )}
                                      </div>
                                    </div>
                                )}

                                {/* Videos */}
                                {parseJsonSafely(project.video_urls).length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                        <Play size={16} className="mr-2 text-purple-600" />
                                        Videos ({parseJsonSafely(project.video_urls).length})
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {parseJsonSafely(project.video_urls).slice(0, 4).map((videoUrl, index) => (
                                            <div key={index} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                                              <video
                                                  src={videoUrl}
                                                  controls
                                                  className="w-full h-48 object-cover rounded-lg shadow-sm mb-2"
                                                  poster={project.thumbnail_url}
                                              >
                                                Your browser does not support the video tag.
                                              </video>
                                              <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium text-gray-900">Video {index + 1}</p>
                                                <a
                                                    href={videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors flex items-center"
                                                >
                                                  <Download size={12} className="mr-1" />
                                                  Download
                                                </a>
                                              </div>
                                            </div>
                                        ))}
                                      </div>
                                      {parseJsonSafely(project.video_urls).length > 4 && (
                                          <p className="text-sm text-gray-500 text-center mt-3">
                                            +{parseJsonSafely(project.video_urls).length - 4} more videos
                                          </p>
                                      )}
                                    </div>
                                )}

                                {/* ZIP Files */}
                                {parseJsonSafely(project.zip_urls).length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                        <Archive size={16} className="mr-2 text-blue-600" />
                                        ZIP Archives ({parseJsonSafely(project.zip_urls).length})
                                      </h4>
                                      <div className="space-y-2">
                                        {parseJsonSafely(project.zip_urls).slice(0, 2).map((zipUrl, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                                              <div className="flex items-center">
                                                <Archive size={20} className="text-blue-600 mr-3" />
                                                <span className="text-sm font-medium">Project Archive {index + 1}</span>
                                              </div>
                                              <a
                                                  href={zipUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                                              >
                                                <Download size={14} className="mr-1" />
                                                Download
                                              </a>
                                            </div>
                                        ))}
                                      </div>
                                    </div>
                                )}
                              </div>
                            </div>
                        )}
                      </div>

                      {/* Right Column - Sidebar */}
                      <div className="space-y-6">

                        {/* Project Links */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <ExternalLink size={18} className="mr-2 text-indigo-600" />
                            Project Links
                          </h3>
                          <div className="space-y-3">
                            {project.github_link && (
                                <a
                                    href={project.github_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                  <GitBranch size={18} className="mr-3" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">GitHub Repository</div>
                                    <div className="text-xs opacity-75 truncate">View source code</div>
                                  </div>
                                  <ExternalLink size={14} />
                                </a>
                            )}
                            {project.demo_link && (
                                <a
                                    href={project.demo_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <Play size={18} className="mr-3" />
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm">Live Demo</div>
                                    <div className="text-xs opacity-75 truncate">View live project</div>
                                  </div>
                                  <ExternalLink size={14} />
                                </a>
                            )}
                            {!project.github_link && !project.demo_link && (
                                <p className="text-sm text-gray-500 text-center py-4">No external links available</p>
                            )}
                          </div>
                        </div>

                        {/* Project Status */}
                        <div className="bg-white rounded-lg border border-gray-200 p-5">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <CheckCircle size={18} className="mr-2 text-green-600" />
                            Project Status
                          </h3>
                          <div className="space-y-3">
                            <InfoRow
                                label="Status"
                                value={
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(project.status)}`}>
                              {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                            </span>
                                }
                            />
                            <InfoRow
                                label="Featured"
                                value={
                                  <span className={`font-medium text-xs ${project.featured ? 'text-yellow-600' : 'text-gray-500'}`}>
                              {project.featured ? '⭐ Yes' : 'No'}
                            </span>
                                }
                            />
                            <InfoRow
                                label="For Sale"
                                value={
                                  <span className={`font-medium text-xs ${project.is_for_sale ? 'text-green-600' : 'text-gray-500'}`}>
                              {project.is_for_sale ? '💰 Yes' : 'No'}
                            </span>
                                }
                            />

                            {project.status === 'rejected' && project.rejection_reason && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <div className="flex items-center mb-2">
                                    <XCircle size={16} className="text-red-600 mr-2" />
                                    <span className="font-medium text-red-900 text-sm">Rejection Reason</span>
                                  </div>
                                  <p className="text-sm text-red-700">{project.rejection_reason}</p>
                                </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}

export default ProjectDetailsModal