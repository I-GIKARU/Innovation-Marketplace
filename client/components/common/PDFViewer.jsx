'use client'

import { useState } from 'react'
import { X, Download, ExternalLink, FileText } from 'lucide-react'

const PDFViewer = ({ isOpen, onClose, pdfUrl, title = "Document" }) => {
  const [loading, setLoading] = useState(true)

  // Early return after all hooks are declared
  if (!isOpen) return null

  const handleLoad = () => {
    setLoading(false)
  }

  const handleError = () => {
    setLoading(false)
    console.error('Failed to load PDF')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl h-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">PDF Document</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
              Open in new tab
            </a>
            <a
              href={pdfUrl}
              download={title}
              className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Download
            </a>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative border rounded-lg overflow-hidden bg-white m-4">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading PDF...</p>
              </div>
            </div>
          )}
          
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{ border: 'none', minHeight: '500px' }}
            title={title}
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
        
        <div className="text-center p-2">
          <p className="text-xs text-gray-500">
            If the PDF doesn't display properly, try opening it in a new tab or downloading it.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PDFViewer
