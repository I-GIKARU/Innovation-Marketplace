"use client"
import React, { useState, useEffect } from 'react'
import { ShoppingBag, Plus } from 'lucide-react'
import ProductTableRow from './ProductTableRow'
import ProductFormModal from './ProductFormModal'
import { apiCall } from '../shared/utils'

const ProductsManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)
  
  // Form modal state
  const [formModal, setFormModal] = useState({
    show: false,
    product: null
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const data = await apiCall('/api/merchandise')
      setProducts(data.merchandise || data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleAddProduct = () => {
    setFormModal({ show: true, product: null })
  }

  const handleEditProduct = (product) => {
    setFormModal({ show: true, product })
  }

  const handleDeleteProduct = async (productId, productName) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return
    }

    setDeletingProduct(productId)
    try {
      await apiCall(`/api/merchandise/${productId}`, {
        method: 'DELETE',
      })

      alert(`Product "${productName}" has been deleted successfully!`)
      fetchProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
      alert(`Failed to delete product: ${err.message}`)
    } finally {
      setDeletingProduct(null)
    }
  }

  const handleFormSuccess = (result) => {
    const isEditing = !!formModal.product
    const actionText = isEditing ? 'updated' : 'created'
    const productName = result.product?.name || result.name || 'Product'
    
    alert(`Product "${productName}" has been ${actionText} successfully!`)
    fetchProducts()
  }

  const closeFormModal = () => {
    setFormModal({ show: false, product: null })
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ShoppingBag className="mr-2" />
          Products Management
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
          <ShoppingBag className="mr-2" />
          Products Management
        </h1>
        <div className="text-red-500 text-center py-8">
          <p>Error loading products: {error}</p>
          <button 
            onClick={fetchProducts}
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
          <ShoppingBag className="mr-2" />
          Products Management
        </h1>
        <button 
          onClick={handleAddProduct}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">No products found</p>
          <button 
            onClick={handleAddProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add First Product
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  deletingProduct={deletingProduct}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProductFormModal
        isOpen={formModal.show}
        onClose={closeFormModal}
        product={formModal.product}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}

export default ProductsManagement
