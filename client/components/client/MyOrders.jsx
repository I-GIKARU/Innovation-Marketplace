'use client'

import React, { useState } from 'react'
import { Package, Clock, CheckCircle, X, Eye, Download, Search, Filter } from 'lucide-react'

const MyOrders = ({ orders, loading, onOrderUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredOrders = orders?.filter(order => {
    const matchesSearch = order.id?.toString().includes(searchTerm.toLowerCase()) ||
                         order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items?.some(item => item.merchandise?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  }) || []

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'amount-high':
        return b.amount - a.amount
      case 'amount-low':
        return a.amount - b.amount
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600">Track and manage your purchases</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm border border-gray-100">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'You haven\'t made any purchases yet'}
            </p>
          </div>
        ) : (
          sortedOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Order #{order.id}
                      </h3>
                      <div className="flex items-center space-x-4 mb-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">KES {order.amount?.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={item.merchandise?.image_url || item.merchandise?.thumbnail_url} 
                          alt={item.merchandise?.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.png';
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.merchandise?.name}</h4>
                          <p className="text-sm text-gray-600">{item.merchandise?.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                            <span className="text-sm text-gray-500">Price: KES {item.price}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">KES {(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="border-t border-gray-100 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Items</p>
                    <p className="font-medium">{order.items?.length || 0} item(s)</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium">{order.payment?.method || 'M-Pesa'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-medium">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {order.status === 'pending' && (
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex items-center justify-end">
                    <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
                      <X className="w-4 h-4 mr-2" />
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {sortedOrders.length > 0 && (
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{sortedOrders.length}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {sortedOrders.filter(o => o.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {sortedOrders.filter(o => o.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                KES {sortedOrders.reduce((sum, o) => sum + (o.amount || 0), 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">Total Spent</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrders
