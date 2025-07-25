"use client"
import StatCard from './StatCard';
import { DollarSign, ShoppingBag, Backpack, SquareActivity, Users, CheckCircle, Clock } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion"

const OverviewPage = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/admin', {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const data = await response.json()
      setDashboardData(data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message)
      setLoading(false)
    }
  }

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
              onClick={fetchDashboardData}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    )
  }

  const stats = dashboardData?.stats || {}

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <main className="max-w-7xl mx-auto py-4 px-4 lg:px-8">
        <motion.div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Users" icon={Users} value={stats.total_users || 0} />
          <StatCard name="Students" icon={Users} value={stats.total_students || 0} />
          <StatCard name="Clients" icon={Users} value={stats.total_clients || 0} />
          <StatCard name="Total Projects" icon={Backpack} value={stats.total_projects || 0} />
          <StatCard name="Approved Projects" icon={CheckCircle} value={stats.approved_projects || 0} />
          <StatCard name="Pending Projects" icon={Clock} value={stats.pending_projects || 0} />
          <StatCard name="Merchandise" icon={ShoppingBag} value={stats.total_merchandise || 0} />
          <StatCard name="Total Orders" icon={SquareActivity} value={stats.total_orders || 0} />
        </motion.div>

        {/* Quick Insights */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1 }}
        >
          <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Approval Rate</h4>
            <div className="text-3xl font-bold">
              {stats.total_projects > 0 
                ? Math.round((stats.approved_projects / stats.total_projects) * 100)
                : 0}%
            </div>
            <p className="text-sm opacity-90 mt-1">
              {stats.approved_projects} of {stats.total_projects} projects approved
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Platform Growth</h4>
            <div className="text-3xl font-bold">
              {stats.total_students + stats.total_clients}
            </div>
            <p className="text-sm opacity-90 mt-1">
              Active users on platform
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 text-white">
            <h4 className="text-lg font-semibold mb-2">Pending Review</h4>
            <div className="text-3xl font-bold">
              {stats.pending_projects || 0}
            </div>
            <p className="text-sm opacity-90 mt-1">
              Projects awaiting approval
            </p>
          </div>
        </motion.div>

        {/* Recent Projects Section */}
        {dashboardData?.recent_projects && dashboardData.recent_projects.length > 0 && (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-700">Recent Projects Pending Review</h3>
              <span className="text-sm text-gray-500">{dashboardData.recent_projects.length} pending</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Project</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Tech Stack</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.recent_projects.map((project) => {
                    const student = project.user_projects?.[0]?.user;
                    return (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                  {project.title?.charAt(0)?.toUpperCase() || 'P'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{project.title}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{project.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          {student?.email || 'N/A'}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {project.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 max-w-xs truncate">
                          {project.tech_stack}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : project.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <a 
                              href={project.demo_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              View Demo
                            </a>
                            <a 
                              href={project.github_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                            >
                              GitHub
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default OverviewPage