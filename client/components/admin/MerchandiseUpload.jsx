'use client'

import { useState } from 'react'
import { Upload, X, Image, DollarSign, Package, CheckCircle } from 'lucide-react'

const MerchandiseUpload = ({ isOpen, onClose, onUploadComplete }) => {
  const [merchandiseData, setMerchandiseData] = useState({
    name: '',
    description: '',
    price: '',
    is_in_stock: true
  })
  
  const [media, setMedia] = useState({
    images: [],
    thumbnail: null
  })
  
  const [previews, setPreviews] = useState({
    images: [],
    thumbnail: null
  })
  
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ stage: '', progress: 0 })

  // Handle file selection
  const handleFileSelect = (files, type) => {
    const fileArray = Array.from(files)
    
    // Validate files (only images for merchandise)
    const validFiles = fileArray.filter(file => 
      file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB
    )

    // Create previews
    const newPreviews = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }))

    if (type === 'thumbnail') {
      setMedia(prev => ({ ...prev, thumbnail: validFiles[0] }))
      setPreviews(prev => ({ ...prev, thumbnail: newPreviews[0] }))
    } else {
      setMedia(prev => ({ ...prev, [type]: [...prev[type], ...validFiles] }))
      setPreviews(prev => ({ ...prev, [type]: [...prev[type], ...newPreviews] }))
    }
  }

  // Remove file
  const removeFile = (index, type) => {
    if (type === 'thumbnail') {
      setMedia(prev => ({ ...prev, thumbnail: null }))
      setPreviews(prev => ({ ...prev, thumbnail: null }))
    } else {
      setMedia(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }))
      setPreviews(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    setUploadProgress({ stage: 'Creating merchandise...', progress: 20 })

    try {
      // Convert price to cents for backend
      const priceInCents = Math.round(parseFloat(merchandiseData.price) * 100)
      
      // Step 1: Create merchandise
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
      const merchandiseResponse = await fetch(`${apiBase}/merchandise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...merchandiseData,
          price: priceInCents
        })
      })

      if (!merchandiseResponse.ok) {
        throw new Error('Failed to create merchandise')
      }

      const merchandiseResult = await merchandiseResponse.json()
      const merchandiseId = merchandiseResult.merchandise.id
      setUploadProgress({ stage: 'Merchandise created! Uploading images...', progress: 40 })

      // Step 2: Upload media if any
      if (media.images.length > 0 || media.thumbnail) {
        const formData = new FormData()
        
        // Add images
        media.images.forEach(image => {
          formData.append('images', image)
        })
        
        // Add thumbnail
        if (media.thumbnail) {
          formData.append('thumbnail', media.thumbnail)
        }

        setUploadProgress({ stage: 'Uploading product images...', progress: 70 })

        const mediaResponse = await fetch(
          `${apiBase}/merchandise/${merchandiseId}/media/upload`,
          {
            method: 'POST',
            credentials: 'include',
            body: formData
          }
        )

        if (!mediaResponse.ok) {
          console.warn('Media upload failed, but merchandise was created')
        }
      }

      setUploadProgress({ stage: 'Upload complete!', progress: 100 })
      
      // Success
      setTimeout(() => {
        onUploadComplete && onUploadComplete(merchandiseResult.merchandise)
        handleClose()
      }, 1000)

    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setMerchandiseData({
      name: '',
      description: '',
      price: '',
      is_in_stock: true
    })
    setMedia({ images: [], thumbnail: null })
    setPreviews({ images: [], thumbnail: null })
    setUploadProgress({ stage: '', progress: 0 })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Add New Merchandise</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="p-6 border-b bg-green-50">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">{uploadProgress.stage}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {/* Merchandise Information */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <input
                  type="text"
                  value={merchandiseData.name}
                  onChange={(e) => setMerchandiseData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Price (USD) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={merchandiseData.price}
                    onChange={(e) => setMerchandiseData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={merchandiseData.description}
                onChange={(e) => setMerchandiseData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-24"
                placeholder="Describe the product..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_in_stock"
                checked={merchandiseData.is_in_stock}
                onChange={(e) => setMerchandiseData(prev => ({ ...prev, is_in_stock: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="is_in_stock" className="text-sm font-medium">
                In Stock
              </label>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Product Images</h3>
            
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Main Product Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {previews.thumbnail ? (
                  <div className="relative">
                    <img
                      src={previews.thumbnail.url}
                      alt="Thumbnail"
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(0, 'thumbnail')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload main image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files, 'thumbnail')}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Additional Images Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Additional Product Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="cursor-pointer block text-center">
                  <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">Click to upload additional images (Max 10MB each)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files, 'images')}
                    className="hidden"
                  />
                </label>
              </div>
              
              {previews.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {previews.images.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index, 'images')}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <span className="text-xs text-gray-500 block mt-1 truncate">
                        {preview.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || !merchandiseData.name || !merchandiseData.price}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Add Merchandise
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MerchandiseUpload
