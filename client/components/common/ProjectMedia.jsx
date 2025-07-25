'use client'

import { useState } from 'react'
import { Video, FileText, Archive, Camera, Eye, Download, ExternalLink } from 'lucide-react'
import { getProjectImages, getProjectVideos, getProjectPDFs, getProjectZIPs } from '@/utils/projectHelpers'
import PDFViewer from './PDFViewer'

const ProjectMedia = ({ project, compact = false, showCounts = true }) => {
  const [imageError, setImageError] = useState(false)
  const [pdfViewer, setPdfViewer] = useState({ isOpen: false, url: '', title: '' })
  
  const images = getProjectImages(project)
  const videos = getProjectVideos(project)
  const pdfs = getProjectPDFs(project)
  const zips = getProjectZIPs(project)
  
  const defaultImage = "/images/marketplace.png"

  // Compact version - just show counts
  if (compact) {
    const mediaCount = videos.length + pdfs.length + zips.length
    if (mediaCount === 0 && !project.thumbnail_url) return null
    
    return (
      <div className="flex items-center gap-2 text-xs text-gray-300">
        {project.thumbnail_url && (
          <div className="flex items-center gap-1">
            <Camera className="w-3 h-3 text-orange-400" />
            <span className="text-white">1</span>
          </div>
        )}
        {videos.length > 0 && (
          <div className="flex items-center gap-1">
            <Video className="w-3 h-3 text-orange-400" />
            <span className="text-white">{videos.length}</span>
          </div>
        )}
        {pdfs.length > 0 && (
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3 text-orange-400" />
            <span className="text-white">{pdfs.length}</span>
          </div>
        )}
        {zips.length > 0 && (
          <div className="flex items-center gap-1">
            <Archive className="w-3 h-3 text-orange-400" />
            <span className="text-white">{zips.length}</span>
          </div>
        )}
      </div>
    )
  }

  // Full version - show thumbnails and lists
  return (
    <div className="space-y-12">
      {/* Thumbnail */}
      {project.thumbnail_url && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Project Thumbnail
            </h4>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative">
              <img
                src={imageError ? defaultImage : project.thumbnail_url}
                alt="Project thumbnail"
                className="w-full max-h-[600px] object-cover rounded-2xl border border-white/20 shadow-2xl backdrop-blur-sm"
                onError={() => setImageError(true)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Project Videos ({videos.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {videos.map((videoUrl, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-3xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
                  <div className="p-6">
                    <div className="mb-4">
                      <h5 className="text-lg font-semibold text-white flex items-center gap-3">
                        <Video className="w-5 h-5 text-orange-400" />
                        Video {index + 1}
                      </h5>
                    </div>
                    <div className="relative">
                      <video 
                        controls
                        className="w-full h-[400px] md:h-[500px] object-cover rounded-xl shadow-lg bg-black border border-white/10"
                        preload="metadata"
                        controlsList="nodownload"
                      >
                        <source src={videoUrl} type="video/mp4" />
                        <source src={videoUrl} type="video/webm" />
                        <source src={videoUrl} type="video/ogg" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDFs */}
      {pdfs.length > 0 && (
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h4 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Documentation ({pdfs.length})
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pdfs.map((pdfUrl, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="w-6 h-6 text-orange-400 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-white truncate">Documentation {index + 1}</h5>
                        <p className="text-sm text-gray-300">PDF Documentation</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setPdfViewer({ 
                        isOpen: true, 
                        url: pdfUrl, 
                        title: `Documentation ${index + 1}` 
                      })}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium"
                      title="View document"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No media message */}
      {!project.thumbnail_url && videos.length === 0 && pdfs.length === 0 && zips.length === 0 && (
        <div className="text-center py-16">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 p-12">
            <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-white mb-2">No Media Files</h3>
            <p className="text-gray-300">No media files have been uploaded for this project yet.</p>
          </div>
        </div>
      )}
      
      {/* PDF Viewer Modal */}
      <PDFViewer 
        isOpen={pdfViewer.isOpen}
        onClose={() => setPdfViewer({ isOpen: false, url: '', title: '' })}
        pdfUrl={pdfViewer.url}
        title={pdfViewer.title}
      />
      
    </div>
  )
}

export default ProjectMedia
