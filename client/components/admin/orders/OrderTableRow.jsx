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
        return <CheckCircle size={16} className="text-green-600" />
      case 'paid':
        return <Package size={16} className="text-blue-600" />
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
        <div className="text-sm text-gray-500">{formatDate(order.date)}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">Purchase</div>
        <div className="text-sm text-gray-500">{order.email || 'N/A'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">KES {order.amount?.toLocaleString()}</div>
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
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          {/* Mark as Completed */}
          {order.status === 'paid' && (
            <button 
              onClick={() => onUpdateStatus(order.id, 'completed')}
              disabled={updatingOrder === order.id}
              className={`${
                updatingOrder === order.id 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-green-600 hover:text-green-900'
              }`}
              title="Mark as Completed"
            >
              {updatingOrder === order.id ? (
                <LoadingSpinner size={16} className="border-green-600" />
              ) : (
                <CheckCircle size={16} />
              )}
            </button>
          )}
          
          {/* Cancel Sale */}
          {(order.status === 'paid' || order.status === 'completed') && (
            <button 
              onClick={() => onUpdateStatus(order.id, 'cancelled')}
              disabled={updatingOrder === order.id}
              className={`${
                updatingOrder === order.id 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-red-600 hover:text-red-900'
              }`}
              title="Cancel Sale"
            >
              {updatingOrder === order.id ? (
                <LoadingSpinner size={16} className="border-red-600" />
              ) : (
                <XCircle size={16} />
              )}
            </button>
          )}
          
          {/* View Details */}
          <button 
            onClick={() => onViewDetails(order)}
            className="text-blue-600 hover:text-blue-900"
            title="View Purchase Details"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default OrderTableRow
