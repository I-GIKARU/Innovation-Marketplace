import React, { useState } from 'react'
import { Search, Eye, Calendar, DollarSign, User, Heart, TrendingUp } from 'lucide-react'

const AdminContributionsManagement = ({ contributions: initialContributions = [], loading: initialLoading = false, error: initialError = null, onRefresh }) => {
  const [contributions, setContributions] = useState(initialContributions)
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState(initialError)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterProject, setFilterProject] = useState('')
  const [stats, setStats] = useState({
    totalContributions: 0,
    totalAmount: 0,
    uniqueContributors: 0,
    averageContribution: 0
  })

  // Update local state when props change
  React.useEffect(() => {
    setContributions(initialContributions)
    setLoading(initialLoading)
    setError(initialError)
    
    // Calculate stats from contributions
    const totalAmount = initialContributions.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0)
    const uniqueContributors = new Set(initialContributions.map(c => c.user_project?.user?.id).filter(Boolean)).size
    
    setStats({
      totalContributions: initialContributions.length,
      totalAmount: totalAmount,
      uniqueContributors: uniqueContributors,
      averageContribution: initialContributions.length > 0 ? totalAmount / initialContributions.length : 0
    })
  }, [initialContributions, initialLoading, initialError])

  // Filter contributions based on search and project filter
  const filteredContributions = contributions.filter(contribution => {
    const matchesSearch = 
      contribution.user_project?.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contribution.user_project?.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contribution.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesProject = !filterProject || contribution.user_project?.project?.title === filterProject
    
    return matchesSearch && matchesProject
  })

  // Get unique projects for filter dropdown
  const uniqueProjects = [...new Set(contributions.map(c => c.user_project?.project?.title).filter(Boolean))]

  const fetchContributions = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('/api/contributions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch contributions')
      }

      const data = await response.json()
      setContributions(data.contributions || [])
      
      // Calculate stats
      const totalAmount = data.contributions.reduce((sum, c) => sum + parseFloat(c.amount || 0), 0)
      const uniqueContributors = new Set(data.contributions.map(c => c.user_project?.user?.id).filter(Boolean)).size
      
      setStats({
        totalContributions: data.contributions.length,
        totalAmount: totalAmount,
        uniqueContributors: uniqueContributors,
        averageContribution: data.contributions.length > 0 ? totalAmount / data.contributions.length : 0
      })
      
      if (onRefresh) onRefresh()
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading contributions...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={onRefresh || fetchContributions}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contribution Management</h1>
            <p className="text-gray-600 mt-1">View and manage all project contributions</p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <Heart className="h-6 w-6" />
            <span className="text-2xl font-bold">{stats.totalContributions}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Contributors</p>
              <p className="text-xl font-bold text-gray-900">{stats.uniqueContributors}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Average</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(stats.averageContribution)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Heart className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Donations</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalContributions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by contributor, project, or comment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Projects</option>
            {uniqueProjects.map((project) => (
              <option key={project} value={project}>
                {project}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Contributions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Contributions ({filteredContributions.length})
          </h2>
        </div>
        
        {filteredContributions.length === 0 ? (
          <div className="p-6 text-center">
            <Heart className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No contributions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterProject ? 'Try adjusting your filters.' : 'No contributions have been made yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contributor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Comment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContributions.map((contribution) => (
                  <tr key={contribution.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {contribution.user_project?.user?.email || 'Unknown Contributor'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {contribution.user_project?.project?.title || 'Unknown Project'}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {contribution.user_project?.project?.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        {formatCurrency(contribution.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contribution.date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {contribution.comment || 'No comment'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminContributionsManagement
