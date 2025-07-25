"use client"
import React from 'react'
import { Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react'
import LoadingSpinner from '../shared/LoadingSpinner'
import { getStatusBadge, formatDate, formatCurrency } from '../shared/utils'

const OrderTableRow = ({ 
  order, 
  onUpdateStatus, 
  onViewDetails,
  updatingOrder
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle size={16} className="text-green-600" />
      case 'processing':
        return <Package size={16} className="text-purple-600" />
      case 'shipped':
        return <Truck size={16} className="text-indigo-600" />
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />
      default:
        return <Package size={16} className="text-gray-600" />
    }
  }

  return (
    <tr key={order.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
        <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{order.customer_name || order.user?.name || 'N/A'}</div>
        <div className="text-sm text-gray-500">{order.customer_email || order.user?.email || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{formatCurrency(order.total_amount)}</div>
        <div className="text-sm text-gray-500">{order.items?.length || 0} items</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {getStatusIcon(order.status)}
          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
            {order.status}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {order.shipping_method || 'Standard'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          {order.status === 'pending' && (
            <>
              <button 
                onClick={() => onUpdateStatus(order.id, 'processing')}
                disabled={updatingOrder === order.id}
                className={`${
                  updatingOrder === order.id 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-purple-600 hover:text-purple-900'
                }`}
                title="Process Order"
              >
                {updatingOrder === order.id ? (
                  <LoadingSpinner size={16} className="border-purple-600" />
                ) : (
                  <Package size={16} />
                )}
              </button>
              <button 
                onClick={() => onUpdateStatus(order.id, 'cancelled')}
                disabled={updatingOrder === order.id}
                className={`${
                  updatingOrder === order.id 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-red-600 hover:text-red-900'
                }`}
                title="Cancel Order"
              >
                {updatingOrder === order.id ? (
                  <LoadingSpinner size={16} className="border-red-600" />
                ) : (
                  <XCircle size={16} />
                )}
              </button>
            </>
          )}
          {order.status === 'processing' && (
            <button 
              onClick={() => onUpdateStatus(order.id, 'shipped')}
              disabled={updatingOrder === order.id}
              className={`${
                updatingOrder === order.id 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-indigo-600 hover:text-indigo-900'
              }`}
              title="Mark as Shipped"
            >
              {updatingOrder === order.id ? (
                <LoadingSpinner size={16} className="border-indigo-600" />
              ) : (
                <Truck size={16} />
              )}
            </button>
          )}
          {order.status === 'shipped' && (
            <button 
              onClick={() => onUpdateStatus(order.id, 'delivered')}
              disabled={updatingOrder === order.id}
              className={`${
                updatingOrder === order.id 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-green-600 hover:text-green-900'
              }`}
              title="Mark as Delivered"
            >
              {updatingOrder === order.id ? (
                <LoadingSpinner size={16} className="border-green-600" />
              ) : (
                <CheckCircle size={16} />
              )}
            </button>
          )}
          <button 
            onClick={() => onViewDetails(order)}
            className="text-blue-600 hover:text-blue-900"
            title="View Order Details"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default OrderTableRow
