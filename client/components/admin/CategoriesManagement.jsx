"use client"
import React, { useState } from 'react'
import { ChartColumnStacked, Plus, Edit, Trash2 } from 'lucide-react'

const CategoriesManagement = ({ categories: initialCategories = [], loading: initialLoading = false, error: initialError = null, onRefresh }) => {
  const [categories, setCategories] = useState(initialCategories)
  const [loading, setLoading] = useState(initialLoading)
  const [error, setError] = useState(initialError)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })

  React.useEffect(() => {
    setCategories(initialCategories)
    setLoading(initialLoading)
    setError(initialError)
  }, [initialCategories, initialLoading, initialError])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data = await response.json()
      setCategories(data.categories || []) // Handle the API response format
      setLoading(false)
      if (onRefresh) onRefresh()
    } catch (err) {
      console.error('Error fetching categories:', err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      })

      if (!response.ok) {
        throw new Error('Failed to add category')
      }

      setNewCategory({ name: '', description: '' })
      setShowAddForm(false)
      fetchCategories()
    } catch (err) {
      console.error('Error adding category:', err)
      alert('Failed to add category')
    }
  }

  const handleDeleteCategory = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete category')
      }

      fetchCategories()
    } catch (err) {
      console.error('Error deleting category:', err)
      alert('Failed to delete category')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <ChartColumnStacked className="mr-2" />
          Categories Management
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
          <ChartColumnStacked className="mr-2" />
          Categories Management
        </h1>
        <div className="text-red-500 text-center py-8">
          <p>Error loading categories: {error}</p>
          <button 
            onClick={onRefresh || fetchCategories}
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
          <ChartColumnStacked className="mr-2" />
          Categories Management
        </h1>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Add Category
        </button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
          <form onSubmit={handleAddCategory}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setNewCategory({ name: '', description: '' })
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="text-center py-12">
          <ChartColumnStacked size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No categories found</p>
          <button 
            onClick={() => setShowAddForm(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {/* Category Stats */}
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Projects:</span>
                  <span className="font-medium">{category.projects?.length || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoriesManagement
