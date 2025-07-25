"use client"
import React from 'react'
import { User, Calendar, Package, MapPin, CreditCard, Truck } from 'lucide-react'
import Modal from '../shared/Modal'
import { getStatusBadge, formatDate, formatCurrency } from '../shared/utils'

const OrderDetailsModal = ({ 
  isOpen, 
  onClose, 
  order, 
  isLoading, 
  error 
}) => {
  if (!isOpen) return null

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Order Details" maxWidth="max-w-4xl">
        <div className="p-6 text-center">
          <div className="animate-pulse space-y-4">
            <div className="bg-gray-200 h-8 rounded w-1/3 mx-auto"></div>
            <div className="bg-gray-200 h-4 rounded w-1/2 mx-auto"></div>
            <div className="bg-gray-200 h-32 rounded"></div>
          </div>
        </div>
      </Modal>
    )
  }

  if (error) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Order Details" maxWidth="max-w-4xl">
        <div className="p-6 text-center text-red-500">
          <p>Error loading order details: {error}</p>
        </div>
      </Modal>
    )
  }

  if (!order) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Order Details" maxWidth="max-w-4xl">
      <div className="p-6">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              Order #{order.id}
            </h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {formatDate(order.created_at)}
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(order.total_amount)}
            </div>
            <div className="text-sm text-gray-500">
              {order.items?.length || 0} items
            </div>
          </div>
        </div>

        {/* Order Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Customer Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <User size={20} className="mr-2" />
              Customer Information
            </h5>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-sm text-gray-600">
                  {order.customer_name || order.user?.name || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-sm text-gray-600">
                  {order.customer_email || order.user?.email || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Phone:</span>
                <span className="ml-2 text-sm text-gray-600">
                  {order.customer_phone || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin size={20} className="mr-2" />
              Shipping Information
            </h5>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Method:</span>
                <span className="ml-2 text-sm text-gray-600">
                  {order.shipping_method || 'Standard'}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Address:</span>
                <div className="ml-2 text-sm text-gray-600">
                  {order.shipping_address ? (
                    <div>
                      <div>{order.shipping_address.street}</div>
                      <div>
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
                      </div>
                      <div>{order.shipping_address.country}</div>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              {order.tracking_number && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Tracking:</span>
                  <span className="ml-2 text-sm text-gray-600 font-mono">
                    {order.tracking_number}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <CreditCard size={20} className="mr-2" />
            Payment Information
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-700">Method:</span>
              <span className="ml-2 text-sm text-gray-600">
                {order.payment_method || 'Credit Card'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {order.payment_status || 'pending'}
              </span>
            </div>
            {order.transaction_id && (
              <div>
                <span className="text-sm font-medium text-gray-700">Transaction ID:</span>
                <span className="ml-2 text-sm text-gray-600 font-mono">
                  {order.transaction_id}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Package size={20} className="mr-2" />
            Order Items
          </h5>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items?.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={item.image || '/placeholder-product.png'} 
                              alt={item.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(item.quantity * item.price)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(order.subtotal || order.total_amount)}
              </span>
            </div>
            {order.tax_amount && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Tax:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(order.tax_amount)}
                </span>
              </div>
            )}
            {order.shipping_cost && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Shipping:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(order.shipping_cost)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between">
                <span className="text-base font-semibold text-gray-900">Total:</span>
                <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(order.total_amount)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <h5 className="text-lg font-semibold text-gray-900 mb-2">Order Notes</h5>
            <p className="text-sm text-gray-700">{order.notes}</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default OrderDetailsModal
