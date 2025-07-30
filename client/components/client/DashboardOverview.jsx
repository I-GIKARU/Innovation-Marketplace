'use client'

import { ShoppingCart, Package, Heart, TrendingUp, Clock, CheckCircle, X, DollarSign } from 'lucide-react'
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

  const { user, orders, stats } = dashboardData

  // Use API stats data or fallback to calculated values
  const totalOrders = stats?.totalOrders || orders?.length || 0
  const completedOrders = stats?.completedOrders || orders?.filter(o => o.status === 'completed').length || 0
  const pendingOrders = stats?.pendingOrders || orders?.filter(o => o.status === 'pending').length || 0
  const cancelledOrders = stats?.cancelledOrders || orders?.filter(o => o.status === 'cancelled').length || 0
  
  const totalSpent = stats?.totalSpent || orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0

  const statsCards = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Spent',
      value: `KES ${totalSpent.toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
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

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">Completed</p>
              <p className="text-lg font-bold text-green-600">{completedOrders}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending</p>
              <p className="text-lg font-bold text-yellow-600">{pendingOrders}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
            <X className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-sm font-medium text-red-800">Cancelled</p>
              <p className="text-lg font-bold text-red-600">{cancelledOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shopping Overview */}
      {totalOrders > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Shopping Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average order value</span>
              <span className="font-semibold">KES {(totalSpent / totalOrders).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completion rate</span>
              <span className="font-semibold">{totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DashboardOverview
