'use client'

import { useState } from 'react'
import { Upload, X, Video, FileText, Archive, Camera, Plus } from 'lucide-react'

const MediaUpload = ({ media, setMedia, previews, setPreviews }) => {
  // Handle file selection
  const handleFileSelect = (files, type) => {
    const fileArray = Array.from(files)
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      if (type === 'videos') {
        return file.type.startsWith('video/') && file.size <= 100 * 1024 * 1024 // 100MB
      } else if (type === 'thumbnail') {
        return file.type.startsWith('image/') && file.size <= 10 * 1024 * 1024 // 10MB
      } else if (type === 'pdfs') {
        return file.type === 'application/pdf' && file.size <= 50 * 1024 * 1024 // 50MB
      } else if (type === 'zips') {
        return (file.type === 'application/zip' || file.type === 'application/x-zip-compressed') && file.size <= 100 * 1024 * 1024 // 100MB
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

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Project Media</h3>
      
      {/* Thumbnail Upload */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-600" />
            Thumbnail Image
          </label>
          {!previews.thumbnail && (
            <label className="cursor-pointer bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Add
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files, 'thumbnail')}
                className="hidden"
              />
            </label>
          )}
        </div>
        
        {previews.thumbnail ? (
          <div className="relative inline-block">
            <img
              src={previews.thumbnail.url}
              alt="Thumbnail"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => removeFile(0, 'thumbnail')}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No thumbnail selected</p>
        )}
      </div>

      {/* File Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Videos Upload */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Video className="w-4 h-4 text-purple-600" />
              Videos
            </label>
            <label className="cursor-pointer bg-purple-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-purple-700 flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Add
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleFileSelect(e.target.files, 'videos')}
                className="hidden"
              />
            </label>
          </div>
          
          {previews.videos.length > 0 ? (
            <div className="space-y-2">
              {previews.videos.map((preview, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Video className="w-3 h-3 text-purple-600 flex-shrink-0" />
                    <span className="truncate">{preview.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index, 'videos')}
                    className="text-red-500 hover:bg-red-100 p-1 rounded ml-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No videos uploaded</p>
          )}
        </div>

        {/* PDFs Upload */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-red-600" />
              Documents
            </label>
            <label className="cursor-pointer bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Add
              <input
                type="file"
                accept=".pdf,application/pdf"
                multiple
                onChange={(e) => handleFileSelect(e.target.files, 'pdfs')}
                className="hidden"
              />
            </label>
          </div>
          
          {previews.pdfs.length > 0 ? (
            <div className="space-y-2">
              {previews.pdfs.map((preview, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText className="w-3 h-3 text-red-600 flex-shrink-0" />
                    <span className="truncate">{preview.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index, 'pdfs')}
                    className="text-red-500 hover:bg-red-100 p-1 rounded ml-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No documents uploaded</p>
          )}
        </div>

        {/* ZIPs Upload */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium flex items-center gap-2">
              <Archive className="w-4 h-4 text-green-600" />
              Archives
            </label>
            <label className="cursor-pointer bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 flex items-center gap-1">
              <Plus className="w-3 h-3" />
              Add
              <input
                type="file"
                accept=".zip,.ZIP,application/zip,application/x-zip-compressed"
                multiple
                onChange={(e) => handleFileSelect(e.target.files, 'zips')}
                className="hidden"
              />
            </label>
          </div>
          
          {previews.zips.length > 0 ? (
            <div className="space-y-2">
              {previews.zips.map((preview, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Archive className="w-3 h-3 text-green-600 flex-shrink-0" />
                    <span className="truncate">{preview.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index, 'zips')}
                    className="text-red-500 hover:bg-red-100 p-1 rounded ml-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No archives uploaded</p>
          )}
        </div>
      </div>

      {/* Upload Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 font-medium mb-2">Upload Guidelines:</p>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• <strong>Thumbnail:</strong> Main project image (10MB max)</li>
          <li>• <strong>Videos:</strong> Demos, presentations (100MB max each)</li>
          <li>• <strong>Documents:</strong> PDF reports, documentation (50MB max each)</li>
          <li>• <strong>Archives:</strong> Source code, project files (100MB max each)</li>
        </ul>
      </div>
    </div>
  )
}

export default MediaUpload
