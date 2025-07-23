'use client'

import { useState } from 'react'
import { Video, FileText, Archive, Camera, Eye, Download, ExternalLink } from 'lucide-react'
import { getProjectImages, getProjectVideos, getProjectPDFs, getProjectZIPs } from '@/utils/projectHelpers'
import PDFViewer from './PDFViewer'
import VideoPlayer from './VideoPlayer'

const ProjectMedia = ({ project, compact = false, showCounts = true }) => {
  const [imageError, setImageError] = useState(false)
  const [pdfViewer, setPdfViewer] = useState({ isOpen: false, url: '', title: '' })
  const [videoPlayer, setVideoPlayer] = useState({ isOpen: false, url: '', title: '' })
  
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
      <div className="flex items-center gap-2 text-xs text-gray-500">
        {project.thumbnail_url && (
          <div className="flex items-center gap-1">
            <Camera className="w-3 h-3 text-blue-600" />
            <span>1</span>
          </div>
        )}
        {videos.length > 0 && (
          <div className="flex items-center gap-1">
            <Video className="w-3 h-3 text-purple-600" />
            <span>{videos.length}</span>
          </div>
        )}
        {pdfs.length > 0 && (
          <div className="flex items-center gap-1">
            <FileText className="w-3 h-3 text-red-600" />
            <span>{pdfs.length}</span>
          </div>
        )}
        {zips.length > 0 && (
          <div className="flex items-center gap-1">
            <Archive className="w-3 h-3 text-green-600" />
            <span>{zips.length}</span>
          </div>
        )}
      </div>
    )
  }

  // Full version - show thumbnails and lists
  return (
    <div className="space-y-4">
      {/* Thumbnail */}
      {project.thumbnail_url && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-600" />
            Project Thumbnail
          </h4>
          <div className="relative inline-block">
            <img
              src={imageError ? defaultImage : project.thumbnail_url}
              alt="Project thumbnail"
              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              onError={() => setImageError(true)}
            />
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Video className="w-4 h-4 text-purple-600" />
            Videos ({videos.length})
          </h4>
          <div className="space-y-2">
            {videos.map((videoUrl, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Video className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span className="text-sm truncate">Video {index + 1}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setVideoPlayer({ 
                      isOpen: true, 
                      url: videoUrl, 
                      title: `Video ${index + 1}` 
                    })}
                    className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                    title="Play video"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={videoUrl}
                    download
                    className="p-1 text-purple-600 hover:bg-purple-100 rounded"
                    title="Download video"
                  >
                    <Download className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDFs */}
      {pdfs.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-red-600" />
            Documents ({pdfs.length})
          </h4>
          <div className="space-y-2">
            {pdfs.map((pdfUrl, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileText className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span className="text-sm truncate">Document {index + 1}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPdfViewer({ 
                      isOpen: true, 
                      url: pdfUrl, 
                      title: `Document ${index + 1}` 
                    })}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="View document"
                  >
                    <Eye className="w-3 h-3" />
                  </button>
                  <a
                    href={pdfUrl}
                    download
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                    title="Download document"
                  >
                    <Download className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ZIP Files */}
      {zips.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Archive className="w-4 h-4 text-green-600" />
            Archives ({zips.length})
          </h4>
          <div className="space-y-2">
            {zips.map((zipUrl, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Archive className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm truncate">Archive {index + 1}</span>
                </div>
                <div className="flex gap-1">
                  <a
                    href={zipUrl}
                    download
                    className="p-1 text-green-600 hover:bg-green-100 rounded"
                    title="Download archive"
                  >
                    <Download className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No media message */}
      {!project.thumbnail_url && videos.length === 0 && pdfs.length === 0 && zips.length === 0 && (
        <div className="text-center py-4 text-gray-500">
          <Camera className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No media files uploaded</p>
        </div>
      )}
      
      {/* PDF Viewer Modal */}
      <PDFViewer 
        isOpen={pdfViewer.isOpen}
        onClose={() => setPdfViewer({ isOpen: false, url: '', title: '' })}
        pdfUrl={pdfViewer.url}
        title={pdfViewer.title}
      />
      
      {/* Video Player Modal */}
      <VideoPlayer 
        isOpen={videoPlayer.isOpen}
        onClose={() => setVideoPlayer({ isOpen: false, url: '', title: '' })}
        videoUrl={videoPlayer.url}
        title={videoPlayer.title}
      />
    </div>
  )
}

export default ProjectMedia
