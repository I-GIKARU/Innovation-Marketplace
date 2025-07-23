'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Download, ExternalLink, Video, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react'

const VideoPlayer = ({ isOpen, onClose, videoUrl, title = "Video" }) => {
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const videoRef = useRef(null)
  const containerRef = useRef(null)

  const handleLoad = () => {
    setLoading(false)
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleError = () => {
    setLoading(false)
    console.error('Failed to load video')
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setPlaying(!playing)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted
      setMuted(!muted)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleSeek = (e) => {
    const seekTime = parseFloat(e.target.value)
    setCurrentTime(seekTime)
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime
    }
  }

  const toggleFullscreen = () => {
    if (!fullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setFullscreen(!fullscreen)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setPlaying(false)
      setCurrentTime(0)
      setLoading(true)
    }
  }, [isOpen])

  // Don't render anything if modal is not open
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
      <div 
        ref={containerRef}
        className={`bg-black rounded-lg w-full max-w-4xl h-auto max-h-[95vh] sm:max-h-[90vh] flex flex-col ${
          fullscreen ? 'max-w-full max-h-full rounded-none' : ''
        }`}
      >
        {/* Header */}
        {!fullscreen && (
          <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <Video className="w-6 h-6 text-purple-400" />
              <div>
                <h3 className="font-semibold text-white">{title}</h3>
                <p className="text-sm text-gray-400">Video Content</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                Open in new tab
              </a>
              <a
                href={videoUrl}
                download={title}
                className="px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center gap-1"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Video Content */}
        <div className="relative bg-black flex items-center justify-center" style={{ minHeight: '400px', maxHeight: '60vh' }}>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-400">Loading video...</p>
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full max-h-full object-contain"
            style={{ maxHeight: '60vh' }}
            onLoadedData={handleLoad}
            onError={handleError}
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onClick={togglePlay}
          />
        </div>

        {/* Video Controls */}
        <div className="bg-gray-900 p-4 rounded-b-lg">
          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full video-slider cursor-pointer"
              style={{
                background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider cursor-pointer"
                />
              </div>
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              {fullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Fullscreen close button */}
        {fullscreen && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white bg-black bg-opacity-50 hover:bg-opacity-70 rounded-lg z-20"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  )
}

export default VideoPlayer
