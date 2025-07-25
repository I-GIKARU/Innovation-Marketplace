"use client"
import React from 'react'
import { Edit, Trash2 } from 'lucide-react'
import LoadingSpinner from '../shared/LoadingSpinner'
import { formatCurrency } from '../shared/utils'

const ProductTableRow = ({ 
  product, 
  onEdit, 
  onDelete,
  deletingProduct
}) => {
  return (
    <tr key={product.id}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img 
              className="h-10 w-10 rounded-full object-cover" 
              src={product.image_url || '/placeholder-product.png'} 
              alt={product.name}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{product.name}</div>
            <div className="text-sm text-gray-500">
              {product.description?.length > 50 
                ? `${product.description.substring(0, 50)}...` 
                : product.description
              }
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {formatCurrency(product.price || 0)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        <span className={`font-medium ${
          (product.quantity || 0) <= 5 
            ? 'text-red-600' 
            : (product.quantity || 0) <= 10 
            ? 'text-yellow-600' 
            : 'text-green-600'
        }`}>
          {product.quantity !== undefined ? product.quantity : 'N/A'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(product)}
            className="text-indigo-600 hover:text-indigo-900 p-2 rounded-md hover:bg-indigo-50 transition-colors"
            title="Edit Product"
          >
            <Edit size={16} />
          </button>
          <button 
            onClick={() => onDelete(product.id, product.name)}
            disabled={deletingProduct === product.id}
            className={`p-2 rounded-md transition-colors ${
              deletingProduct === product.id 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-red-600 hover:text-red-900 hover:bg-red-50'
            }`}
            title={deletingProduct === product.id ? 'Deleting...' : 'Delete Product'}
          >
            {deletingProduct === product.id ? (
              <LoadingSpinner size={16} className="border-red-500" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ProductTableRow
