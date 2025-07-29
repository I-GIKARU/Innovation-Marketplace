"use client"
import React from 'react'
import { User, Calendar, Package, ShoppingBag } from 'lucide-react'
import Modal from '../shared/Modal'
import { getStatusBadge, formatDate, formatCurrency } from '../shared/utils'

const OrderDetailsModal = ({
  isOpen, 
  onClose, 
  order: sale, 
  isLoading, 
  error 
}) => {
  if (!isOpen) return null

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Purchase Details" maxWidth="max-w-3xl">
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
      <Modal isOpen={isOpen} onClose={onClose} title="Purchase Details" maxWidth="max-w-3xl">
        <div className="p-6 text-center text-red-500">
          <p>Error loading purchase details: {error}</p>
        </div>
      </Modal>
    )
  }

  if (!sale) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Purchase Details" maxWidth="max-w-3xl">
      <div className="p-6">
        {/* Sale Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              Purchase #{sale.id}
            </h4>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                {formatDate(sale.date)}
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(sale.status)}`}>
                  {sale.status}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              KES {sale.amount?.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              {sale.items?.length || 0} items
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <User size={20} className="mr-2" />
            Customer Information
          </h5>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700">Email:</span>
              <span className="ml-2 text-sm text-gray-600">
                {sale.email || 'N/A'}
              </span>
            </div>
            {sale.user && (
              <div>
                <span className="text-sm font-medium text-gray-700">Registered User:</span>
                <span className="ml-2 text-sm text-gray-600">
                  Yes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Purchased Items */}
        <div className="mb-6">
          <h5 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            <Package size={20} className="mr-2" />
            Purchased Items
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
                {sale.items?.length > 0 ? (
                  sale.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={item.merchandise?.image_url || '/placeholder-product.png'} 
                              alt={item.merchandise?.name || 'Product'}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.merchandise?.name || 'Unknown Item'}</div>
                            <div className="text-sm text-gray-500">{item.merchandise?.description || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        KES {item.price?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        KES {(item.quantity * item.price)?.toLocaleString()}
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

        {/* Purchase Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h5 className="text-lg font-semibold text-gray-900 mb-3">Purchase Summary</h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-base font-semibold text-gray-900">Total:</span>
              <span className="text-base font-semibold text-gray-900">
                KES {sale.amount?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default OrderDetailsModal
