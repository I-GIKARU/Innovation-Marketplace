'use client'

import { CheckCircle } from 'lucide-react'

const UploadProgress = ({ uploadProgress, uploading }) => {
  if (!uploading) return null

  return (
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
  )
}

export default UploadProgress
