"use client"
import React from 'react'
import { 
  X, User, Calendar, Eye, ExternalLink, Download, Play, FileText, 
  Archive, Star, DollarSign, Users, GitBranch, Mail, UserCheck,
  CheckCircle, XCircle, Clock, Tag, MousePointer, BarChart3
} from 'lucide-react'
import { parseJsonSafely, getStatusBadge, formatDate } from '../shared/utils'

const ProjectDetailsDrawer = ({ 
  isOpen, 
  onClose, 
  project, 
  isLoading, 
  error 
}) => {
  if (!isOpen) return null

  // Helper function to safely render values that might be objects
  const renderValue = (value) => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'string' || typeof value === 'number') return value
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    if (typeof value === 'object') {
      // Handle common object patterns
      if (value.name) return value.name
      if (value.title) return value.title
      if (value.label) return value.label
      if (value.email) return value.email
      // Fallback for unknown objects
      return JSON.stringify(value)
    }
    return String(value)
  }

  const InfoCard = ({ title, children, icon: Icon, className = "" }) => (
    <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
      <div className="flex items-center mb-3">
        {Icon && <Icon size={18} className="text-gray-600 mr-2" />}
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  )

  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center">
        {Icon && <Icon size={16} className="text-gray-500 mr-2" />}
        <span className="text-sm font-medium text-gray-700">{label}:</span>
      </div>
      <div className="text-sm text-gray-900 text-right flex-1 ml-4">
        {React.isValidElement(value) ? value : renderValue(value)}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`absolute right-0 top-0 h-full w-full max-w-4xl bg-gray-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="h-full overflow-y-auto pb-20">
          {isLoading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-6">
                <div className="bg-gray-200 h-48 rounded-lg"></div>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <div className="text-red-500 mb-4">
                <XCircle size={48} className="mx-auto mb-2" />
                <p>Error loading project details: {error}</p>
              </div>
            </div>
          ) : project ? (
            <div className="p-6 space-y-6">
              
              {/* Project Header */}
              <InfoCard title="Project Overview" icon={Archive}>
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
                      <p className="text-gray-600 leading-relaxed">{project.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <InfoRow label="Tech Stack" value={project.tech_stack || 'N/A'} icon={GitBranch} />
                      <InfoRow label="Category" value={typeof project.category === 'string' ? project.category : project.category?.name || 'N/A'} icon={Tag} />
                      <InfoRow 
                        label="Status" 
                        value={
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(project.status)}`}>
                            {project.status}
                          </span>
                        } 
                        icon={project.status === 'approved' ? CheckCircle : project.status === 'rejected' ? XCircle : Clock} 
                      />
                      <InfoRow label="Featured" value={project.featured ? '⭐ Yes' : 'No'} icon={Star} />
                    </div>
                  </div>
                </div>
              </InfoCard>

              {/* Statistics */}
              <InfoCard title="Project Statistics" icon={BarChart3}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Eye className="mx-auto mb-2 text-blue-600" size={24} />
                    <div className="text-2xl font-bold text-blue-600">{project.views || 0}</div>
                    <div className="text-sm text-gray-600">Views</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <MousePointer className="mx-auto mb-2 text-green-600" size={24} />
                    <div className="text-2xl font-bold text-green-600">{project.clicks || 0}</div>
                    <div className="text-sm text-gray-600">Clicks</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Download className="mx-auto mb-2 text-purple-600" size={24} />
                    <div className="text-2xl font-bold text-purple-600">{project.downloads || 0}</div>
                    <div className="text-sm text-gray-600">Downloads</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Calendar className="mx-auto mb-2 text-orange-600" size={24} />
                    <div className="text-sm font-semibold text-orange-600">Created</div>
                    <div className="text-xs text-gray-600">{formatDate(project.created_at)}</div>
                  </div>
                </div>
              </InfoCard>

              {/* Student & Contributors Info */}
              <InfoCard title="Contributors / User Info" icon={Users}>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Student Information</h4>
                    <div className="space-y-2">
                      <InfoRow 
                        label="Student Email" 
                        value={project.user_projects?.[0]?.user?.email || 'N/A'} 
                        icon={Mail} 
                      />
                      <InfoRow 
                        label="Role" 
                        value={project.user_projects?.[0]?.user?.role || 'student'} 
                        icon={UserCheck} 
                      />
                      <InfoRow 
                        label="Interested In" 
                        value={project.user_projects?.[0]?.interested_in || 'contributor'} 
                        icon={User} 
                      />
                      <InfoRow 
                        label="Technical Mentor" 
                        value={project.technical_mentor || 'N/A'} 
                        icon={User} 
                      />
                    </div>
                  </div>

                  {/* External Collaborators */}
                  {parseJsonSafely(project.external_collaborators).length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">External Collaborators</h4>
                      <div className="space-y-3">
                        {parseJsonSafely(project.external_collaborators).map((collaborator, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                            <div>
                              <div className="font-medium">{collaborator.name}</div>
                              {collaborator.github && (
                                <a 
                                  href={collaborator.github} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                  <GitBranch size={14} className="mr-1" />
                                  GitHub Profile
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </InfoCard>

              {/* Project Links */}
              <InfoCard title="Project Links" icon={ExternalLink}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.github_link && (
                    <a 
                      href={project.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <GitBranch size={20} className="mr-3" />
                      <div>
                        <div className="font-medium">GitHub Repository</div>
                        <div className="text-sm opacity-75">View source code</div>
                      </div>
                      <ExternalLink size={16} className="ml-auto" />
                    </a>
                  )}
                  {project.demo_link && (
                    <a 
                      href={project.demo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Play size={20} className="mr-3" />
                      <div>
                        <div className="font-medium">Live Demo</div>
                        <div className="text-sm opacity-75">View live project</div>
                      </div>
                      <ExternalLink size={16} className="ml-auto" />
                    </a>
                  )}
                </div>
              </InfoCard>

              {/* Project Status */}
              <InfoCard title="Project Status" icon={CheckCircle}>
                <div className="space-y-3">
                  <InfoRow 
                    label="Status" 
                    value={
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(project.status)}`}>
                        {project.status?.charAt(0).toUpperCase() + project.status?.slice(1)}
                      </span>
                    } 
                  />
                  <InfoRow label="Featured" value={project.featured ? 'Yes' : 'No'} />
                  <InfoRow label="Is for Sale" value={project.is_for_sale ? 'Yes' : 'No'} />
                  
                  {project.status === 'rejected' && project.rejection_reason && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center mb-2">
                        <XCircle size={18} className="text-red-600 mr-2" />
                        <span className="font-semibold text-red-900">Rejection Reason</span>
                      </div>
                      <p className="text-sm text-red-700">{project.rejection_reason}</p>
                    </div>
                  )}
                </div>
              </InfoCard>

              {/* File Assets */}
              <InfoCard title="Available Assets" icon={Archive}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <FileText className="mx-auto mb-2 text-green-600" size={24} />
                    <div className="text-sm font-medium">PDF(s)</div>
                    <div className="text-xs text-gray-600">
                      {parseJsonSafely(project.pdf_urls).length > 0 ? '✅ Present' : '❌ Not available'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Archive className="mx-auto mb-2 text-blue-600" size={24} />
                    <div className="text-sm font-medium">ZIP file(s)</div>
                    <div className="text-xs text-gray-600">
                      {parseJsonSafely(project.zip_urls).length > 0 ? '✅ Present' : '❌ Not available'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Play className="mx-auto mb-2 text-purple-600" size={24} />
                    <div className="text-sm font-medium">Video(s)</div>
                    <div className="text-xs text-gray-600">
                      {parseJsonSafely(project.video_urls).length > 0 ? '✅ Present' : '❌ Not available'}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Archive className="mx-auto mb-2 text-orange-600" size={24} />
                    <div className="text-sm font-medium">Thumbnail</div>
                    <div className="text-xs text-gray-600">
                      {project.thumbnail_url ? '✅ Present' : '❌ Not available'}
                    </div>
                  </div>
                </div>
              </InfoCard>

              {/* Media Files */}
              {(parseJsonSafely(project.pdf_urls).length > 0 || 
                parseJsonSafely(project.video_urls).length > 0 || 
                parseJsonSafely(project.zip_urls).length > 0) && (
                <InfoCard title="Project Files & Media" icon={Archive}>
                  <div className="space-y-6">
                    
                    {/* PDFs */}
                    {parseJsonSafely(project.pdf_urls).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <FileText size={18} className="mr-2 text-green-600" />
                          PDF Documents ({parseJsonSafely(project.pdf_urls).length})
                        </h4>
                        <div className="space-y-2">
                          {parseJsonSafely(project.pdf_urls).map((pdfUrl, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                              <div className="flex items-center">
                                <FileText size={20} className="text-green-600 mr-3" />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    PDF Document {index + 1}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Click to download PDF file
                                  </p>
                                </div>
                              </div>
                              <a 
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-800 p-2 rounded-md hover:bg-green-200 transition-colors"
                                title="Download PDF"
                              >
                                <Download size={18} />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Videos */}
                    {parseJsonSafely(project.video_urls).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Play size={18} className="mr-2 text-purple-600" />
                          Videos ({parseJsonSafely(project.video_urls).length})
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {parseJsonSafely(project.video_urls).map((videoUrl, index) => (
                            <div key={index} className="relative bg-purple-50 rounded-lg p-4">
                              <video 
                                src={videoUrl}
                                controls
                                className="w-full h-48 object-cover rounded-lg shadow-sm"
                              >
                                Your browser does not support the video tag.
                              </video>
                              <p className="text-sm text-gray-600 mt-2 font-medium">
                                Video {index + 1}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ZIP Files */}
                    {parseJsonSafely(project.zip_urls).length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <Archive size={18} className="mr-2 text-blue-600" />
                          ZIP Archives ({parseJsonSafely(project.zip_urls).length})
                        </h4>
                        <div className="space-y-2">
                          {parseJsonSafely(project.zip_urls).map((zipUrl, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                              <div className="flex items-center">
                                <Archive size={20} className="text-blue-600 mr-3" />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    Project Archive {index + 1}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Complete project files in ZIP format
                                  </p>
                                </div>
                              </div>
                              <a 
                                href={zipUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-200 transition-colors"
                                title="Download ZIP"
                              >
                                <Download size={18} />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </InfoCard>
              )}

            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailsDrawer
