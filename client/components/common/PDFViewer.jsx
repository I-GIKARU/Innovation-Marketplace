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
    <div className="fixed inset-0 bg-gradient-to-br from-[#0a1128] via-slate-900 to-[#0a1128] backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 w-full max-w-6xl h-full max-h-[95vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{title}</h3>
              <p className="text-sm text-gray-300">PDF Documentation Viewer</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-3 text-white hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative overflow-hidden bg-white/5 backdrop-blur-sm rounded-b-3xl m-4 border border-white/10">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm z-10 rounded-3xl">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p className="text-lg font-semibold text-white">Loading Documentation...</p>
              </div>
            </div>
          )}
          
          <iframe
            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
            width="100%"
            height="100%"
            style={{ border: 'none', minHeight: '600px', borderRadius: '1.5rem' }}
            title={title}
            onLoad={handleLoad}
            onError={handleError}
          />
        </div>
      </div>
    </div>
  )
}

export default PDFViewer
