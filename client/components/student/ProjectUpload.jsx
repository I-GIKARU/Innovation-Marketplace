'use client'

import { useState, useEffect } from 'react'
import { Upload, X, Image, Video, FileText, AlertCircle, CheckCircle, FolderOpen } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const ProjectUpload = ({ isOpen, onClose, onUploadComplete }) => {
  const { authFetch } = useAuth()
  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    github_link: '',
    demo_link: '',
    category_id: 1,
    technical_mentor: '',
    is_for_sale: false
  })
  
  const [media, setMedia] = useState({
    images: [],
    videos: [],
    thumbnail: null
  })
  
  const [previews, setPreviews] = useState({
    images: [],
    videos: [],
    thumbnail: null
  })
  
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState({ stage: '', progress: 0 })
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Fetching categories...')
        const data = await authFetch('/categories')
        console.log('Categories data:', data)
        setCategories(data.categories || [])
        // Set default category to first available category if current category_id is 1 (default)
        if ((data.categories || []).length > 0 && projectData.category_id === 1) {
          setProjectData(prev => ({ ...prev, category_id: data.categories[0].id }))
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoadingCategories(false)
      }
    }

    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  // Handle file selection
  const handleFileSelect = (files, type) => {
    const fileArray = Array.from(files)
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      if (type === 'images') {
        return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB
      } else if (type === 'videos') {
        return file.type.startsWith('video/') && file.size <= 100 * 1024 * 1024 // 100MB
      } else if (type === 'thumbnail') {
        return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB
      }
      return false
    })

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
    setUploadProgress({ stage: 'Creating project...', progress: 20 })

    try {
      // Step 1: Create project
      const projectResult = await authFetch('/projects/create', {
        method: 'POST',
        body: JSON.stringify(projectData)
      })
      const projectId = projectResult.project.id
      setUploadProgress({ stage: 'Project created! Uploading media...', progress: 40 })

      // Step 2: Upload media if any
      if (media.images.length > 0 || media.videos.length > 0 || media.thumbnail) {
        const formData = new FormData()
        
        // Add images
        media.images.forEach(image => {
          formData.append('images', image)
        })
        
        // Add videos
        media.videos.forEach(video => {
          formData.append('videos', video)
        })
        
        // Add thumbnail
        if (media.thumbnail) {
          formData.append('thumbnail', media.thumbnail)
        }

        setUploadProgress({ stage: 'Uploading media files...', progress: 70 })

        try {
          const mediaResult = await authFetch(
            `/projects/${projectId}/media/upload`,
            {
              method: 'POST',
              body: formData
            }
          )
          console.log('Media upload successful:', mediaResult)
        } catch (mediaError) {
          console.warn('Media upload failed, but project was created:', mediaError)
        }
      }

      setUploadProgress({ stage: 'Upload complete!', progress: 100 })
      
      // Success
      setTimeout(() => {
        onUploadComplete && onUploadComplete(projectResult.project)
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
    setProjectData({
      title: '',
      description: '',
      tech_stack: '',
      github_link: '',
      demo_link: '',
      category_id: 1,
      technical_mentor: '',
      is_for_sale: false
    })
    setMedia({ images: [], videos: [], thumbnail: null })
    setPreviews({ images: [], videos: [], thumbnail: null })
    setUploadProgress({ stage: '', progress: 0 })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">Upload New Project</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Progress */}
        {uploading && (
          <div className="p-6 border-b bg-blue-50">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium">{uploadProgress.stage}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress.progress}%` }}
              />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6">
          {/* Project Information */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Project Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Project Title *</label>
                <input
                  type="text"
                  value={projectData.title}
                  onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Tech Stack</label>
                <input
                  type="text"
                  value={projectData.tech_stack}
                  onChange={(e) => setProjectData(prev => ({ ...prev, tech_stack: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="React, Node.js, Python..."
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category *</label>
              {loadingCategories ? (
                <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-gray-500">Loading categories...</span>
                </div>
              ) : (
                <select
                  value={projectData.category_id}
                  onChange={(e) => setProjectData(prev => ({ ...prev, category_id: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={projectData.description}
                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                placeholder="Describe your project..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">GitHub Link</label>
                <input
                  type="url"
                  value={projectData.github_link}
                  onChange={(e) => setProjectData(prev => ({ ...prev, github_link: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Demo Link</label>
                <input
                  type="url"
                  value={projectData.demo_link}
                  onChange={(e) => setProjectData(prev => ({ ...prev, demo_link: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://yourproject.demo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Technical Mentor</label>
              <input
                type="text"
                value={projectData.technical_mentor}
                onChange={(e) => setProjectData(prev => ({ ...prev, technical_mentor: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mentor name"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_for_sale"
                checked={projectData.is_for_sale}
                onChange={(e) => setProjectData(prev => ({ ...prev, is_for_sale: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="is_for_sale" className="text-sm font-medium">
                This project is for sale
              </label>
            </div>
          </div>

          {/* Media Upload Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Project Media</h3>
            
            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Thumbnail Image</label>
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
                    <span className="text-sm text-gray-500">Click to upload thumbnail</span>
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

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Project Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="cursor-pointer block text-center">
                  <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">Click to upload images (Max 10MB each)</span>
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

            {/* Videos Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Project Videos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <label className="cursor-pointer block text-center">
                  <Video className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <span className="text-sm text-gray-500">Click to upload videos (Max 100MB each)</span>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileSelect(e.target.files, 'videos')}
                    className="hidden"
                  />
                </label>
              </div>
              
              {previews.videos.length > 0 && (
                <div className="space-y-2 mt-4">
                  {previews.videos.map((preview, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm truncate flex-1">{preview.name}</span>
                      <span className="text-xs text-gray-500 mx-2">
                        {(preview.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index, 'videos')}
                        className="text-red-500 hover:bg-red-100 p-1 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
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
              disabled={uploading || !projectData.title || !projectData.description || !projectData.category_id}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Project
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectUpload
