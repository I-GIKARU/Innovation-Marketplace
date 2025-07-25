"use client"
import React, { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import OrderTableRow from './OrderTableRow'
import OrderDetailsModal from './OrderDetailsModal'
import { apiCall } from '../shared/utils'

const OrdersManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [updatingOrder, setUpdatingOrder] = useState(null)
  
  // Order details modal state
  const [detailsModal, setDetailsModal] = useState({ 
    show: false, 
    order: null, 
    loading: false, 
    error: null 
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await apiCall('/api/admin/orders')
      setOrders(data.orders || data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrder(orderId)
    try {
      const result = await apiCall(`/api/orders/${orderId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      })
      
      alert(`Order #${orderId} has been updated to ${newStatus} successfully!`)
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      )
    } catch (err) {
      console.error('Error updating order status:', err)
      alert(`Failed to update order status: ${err.message}`)
    } finally {
      setUpdatingOrder(null)
    }
  }

  const openDetailsModal = async (order) => {
    setDetailsModal({ show: true, order: null, loading: true, error: null })
    
    try {
      const data = await apiCall(`/api/orders/${order.id}`)
      const orderData = data.order || data
      
      setDetailsModal({ show: true, order: orderData, loading: false, error: null })
    } catch (err) {
      console.error('Error fetching order details:', err)
      setDetailsModal({ show: true, order: null, loading: false, error: err.message })
    }
  }

  const closeDetailsModal = () => {
    setDetailsModal({ show: false, order: null })
  }

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-2" />
          Orders Management
        </h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingCart className="mr-2" />
          Orders Management
        </h1>
        <div className="text-red-500 text-center py-8">
          <p>Error loading orders: {error}</p>
          <button 
            onClick={fetchOrders}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <ShoppingCart className="mr-2" />
          Orders Management
        </h1>
        
        <div className="flex space-x-2">
          {['all', 'pending', 'completed', 'shipped', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <OrderTableRow
                  key={order.id}
                  order={order}
                  onUpdateStatus={handleStatusUpdate}
                  onViewDetails={openDetailsModal}
                  updatingOrder={updatingOrder}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <OrderDetailsModal
        isOpen={detailsModal.show}
        onClose={closeDetailsModal}
        order={detailsModal.order}
        isLoading={detailsModal.loading}
        error={detailsModal.error}
      />
    </div>
  )
}

export default OrdersManagement
