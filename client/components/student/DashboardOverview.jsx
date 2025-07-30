'use client'

import { Eye, Download, ExternalLink, Star, Clock, CheckCircle, X, TrendingUp, Users, FileText, Upload, MessageSquare, User, Mail, Calendar, DollarSign, Heart, Gift } from 'lucide-react'
import { motion } from "framer-motion"
import CVManager from './CVManager'

const DashboardOverview = ({ dashboardData, loading, error, onRetry, onCVUpload, onCVUpdate }) => {
  if (loading) {
    return (
      <div className="flex-1 overflow-auto relative z-10">
        <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-24"></div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 overflow-auto relative z-10">
        <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
          <div className="text-red-500 text-center py-8">
            <p>Error loading dashboard data: {error}</p>
            <button 
              onClick={onRetry}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  if (!dashboardData) {
    return null
  }

  const { user, projects, stats, client_interests, project_contributions } = dashboardData

  // Use API stats data or fallback to calculated values
  const totalProjects = stats?.totalProjects || projects?.length || 0
  const approvedProjects = stats?.approvedProjects || projects?.filter(p => p.status === 'approved').length || 0
  const pendingProjects = stats?.pendingProjects || projects?.filter(p => p.status === 'pending').length || 0
  const rejectedProjects = stats?.rejectedProjects || projects?.filter(p => p.status === 'rejected').length || 0
  const featuredProjects = stats?.featuredProjects || projects?.filter(p => p.featured).length || 0
  
  const totalViews = stats?.totalViews || projects?.reduce((sum, p) => sum + (p.views || 0), 0) || 0
  const totalClicks = stats?.totalClicks || projects?.reduce((sum, p) => sum + (p.clicks || 0), 0) || 0

  const statsCards = [
    {
      title: 'Total Projects',
      value: totalProjects,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: <Eye className="w-6 h-6" />,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Featured Projects',
      value: featuredProjects,
      icon: <Star className="w-6 h-6" />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <div className={stat.textColor}>
                  {stat.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Status Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Project Status Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Approved</p>
              <p className="text-lg font-bold text-green-600">{approvedProjects}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending Review</p>
              <p className="text-lg font-bold text-yellow-600">{pendingProjects}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <X className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Rejected</p>
              <p className="text-lg font-bold text-red-600">{rejectedProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Overview */}
      {totalProjects > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Engagement Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average views per project</span>
              <span className="font-semibold">{Math.round(totalViews / totalProjects)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total clicks</span>
              <span className="font-semibold">{totalClicks.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Collaboration Messages */}
      {client_interests && client_interests.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Messages & Collaboration Requests</h3>
                <p className="text-sm text-gray-500">People interested in your projects</p>
              </div>
            </div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {client_interests.length} {client_interests.length === 1 ? 'message' : 'messages'}
            </span>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {client_interests.map((interest, index) => {
              const getInterestIcon = (type) => {
                switch (type) {
                  case 'collaboration':
                    return <Users className="w-4 h-4 text-green-600" />
                  case 'hire':
                    return <User className="w-4 h-4 text-blue-600" />
                  case 'purchase':
                    return <FileText className="w-4 h-4 text-purple-600" />
                  default:
                    return <MessageSquare className="w-4 h-4 text-gray-600" />
                }
              }
              
              const getInterestBadgeColor = (type) => {
                switch (type) {
                  case 'collaboration':
                    return 'bg-green-100 text-green-800'
                  case 'hire':
                    return 'bg-blue-100 text-blue-800'
                  case 'purchase':
                    return 'bg-purple-100 text-purple-800'
                  default:
                    return 'bg-gray-100 text-gray-800'
                }
              }
              
              const getInterestLabel = (type) => {
                switch (type) {
                  case 'collaboration':
                    return 'Wants to Collaborate'
                  case 'hire':
                    return 'Wants to Hire'
                  case 'purchase':
                    return 'Wants to Purchase'
                  default:
                    return 'Interested'
                }
              }
              
              return (
                <div key={interest.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {interest.user?.email ? interest.user.email.split('@')[0] : 'Anonymous'}
                          </h4>
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getInterestBadgeColor(interest.interested_in)}`}>
                            {getInterestIcon(interest.interested_in)}
                            <span>{getInterestLabel(interest.interested_in)}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          {interest.user?.email && (
                            <div className="flex items-center space-x-1">
                              <Mail className="w-3 h-3" />
                              <span>{interest.user.email}</span>
                            </div>
                          )}
                          {interest.date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(interest.date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Project Info */}
                    {interest.project && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-700">Project:</p>
                        <p className="text-sm text-gray-500">{interest.project.title}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Content */}
                  {interest.message && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{interest.message}</p>
                    </div>
                  )}
                  
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Project Contributions & Support */}
      {project_contributions && project_contributions.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Heart className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Project Support & Contributions</h3>
                <p className="text-sm text-gray-500">Recent contributions to your projects</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {project_contributions.length} {project_contributions.length === 1 ? 'contribution' : 'contributions'}
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                KSH {project_contributions.reduce((total, contribution) => total + (contribution.amount || 0), 0).toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {project_contributions.map((contribution, index) => {
              const contributorName = contribution.user_project?.user?.email ? 
                contribution.user_project.user.email.split('@')[0] : 'Anonymous Supporter'
              const projectTitle = contribution.user_project?.project?.title || 'Unknown Project'
              
              return (
                <div key={contribution.id || index} className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-200 hover:border-orange-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {contributorName}
                          </h4>
                          <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <DollarSign className="w-3 h-3" />
                            <span>KSH {contribution.amount?.toFixed(2) || '0.00'}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{projectTitle}</span>
                          </div>
                          {contribution.date && (
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(contribution.date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Amount Display */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">KSH {contribution.amount?.toFixed(2) || '0.00'}</p>
                      <p className="text-sm text-gray-500">Contribution</p>
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  {contribution.comment && (
                    <div className="mt-3 p-3 bg-white rounded border border-orange-200">
                      <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{contribution.comment}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Summary Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Project Support:</span>
              <span className="font-semibold text-green-600">
                KSH {project_contributions.reduce((total, contribution) => total + (contribution.amount || 0), 0).toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Contributions help fund your project development and show community support.
            </p>
          </div>
        </div>
      )}

      {/* Empty State for Contributions */}
      {(!project_contributions || project_contributions.length === 0) && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Contributions Yet</h3>
            <p className="text-gray-600 mb-4">
              When people support your projects, their contributions will appear here.
            </p>
            <p className="text-sm text-gray-500">
              Share your projects to get more visibility and potential support from the community.
            </p>
          </div>
        </div>
      )}

      {/* CV Management Section */}
      <CVManager 
        userData={user} 
        onCVUpdate={onCVUpdate} 
      />
    </div>
  )
}

export default DashboardOverview
