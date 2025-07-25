'use client'

import { Eye, Download, ExternalLink, Star, Clock, CheckCircle, X, TrendingUp, Users } from 'lucide-react'
import { motion } from "framer-motion"

const DashboardOverview = ({ dashboardData, loading, error, onRetry }) => {
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

  const { user, projects, stats } = dashboardData

  // Use API stats data or fallback to calculated values
  const totalProjects = stats?.totalProjects || projects?.length || 0
  const approvedProjects = stats?.approvedProjects || projects?.filter(p => p.status === 'approved').length || 0
  const pendingProjects = stats?.pendingProjects || projects?.filter(p => p.status === 'pending').length || 0
  const rejectedProjects = stats?.rejectedProjects || projects?.filter(p => p.status === 'rejected').length || 0
  const featuredProjects = stats?.featuredProjects || projects?.filter(p => p.featured).length || 0
  
  const totalViews = stats?.totalViews || projects?.reduce((sum, p) => sum + (p.views || 0), 0) || 0
  const totalClicks = stats?.totalClicks || projects?.reduce((sum, p) => sum + (p.clicks || 0), 0) || 0
  const totalDownloads = stats?.totalDownloads || projects?.reduce((sum, p) => sum + (p.downloads || 0), 0) || 0

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
      title: 'Total Downloads',
      value: totalDownloads.toLocaleString(),
      icon: <Download className="w-6 h-6" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
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
              <span className="text-sm text-gray-600">Average downloads per project</span>
              <span className="font-semibold">{Math.round(totalDownloads / totalProjects)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total clicks</span>
              <span className="font-semibold">{totalClicks.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardOverview
