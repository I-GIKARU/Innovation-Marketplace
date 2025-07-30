'use client'

import { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuthContext } from '@/contexts/AuthContext'

// Import our smaller components
import ProjectInfoForm from './project-upload/ProjectInfoForm'
import CollaboratorsForm from './project-upload/CollaboratorsForm'
import MediaUpload from './project-upload/MediaUpload'
import UploadProgress from './project-upload/UploadProgress'

const ProjectUpload = ({ isOpen, onClose, onUploadComplete }) => {
    const { authFetch } = useAuthContext();
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
  
  const [collaborators, setCollaborators] = useState([{ name: '', github: '' }])
  
  const [media, setMedia] = useState({
    videos: [],
    pdfs: [],
    zips: [],
    thumbnail: null
  })
  
  const [previews, setPreviews] = useState({
    videos: [],
    pdfs: [],
    zips: [],
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    setUploadProgress({ stage: 'Creating project...', progress: 20 })

    try {
      const projectPayload = {
        ...projectData,
        collaborators: collaborators.filter(collab => collab.name.trim() !== '' || collab.github.trim() !== '')
      }
      const projectResult = await authFetch('/projects/create', {
        method: 'POST',
        body: JSON.stringify(projectPayload)
      })
      const projectId = projectResult.project.id
      setUploadProgress({ stage: 'Project created! Uploading media...', progress: 40 })

      // Step 2: Upload media if any (removed images from check)
      if (media.videos.length > 0 || media.pdfs.length > 0 || media.zips.length > 0 || media.thumbnail) {
        const formData = new FormData()
        
        // Add videos
        media.videos.forEach(video => {
          formData.append('videos', video)
        })
        
        // Add PDFs
        media.pdfs.forEach(pdf => {
          formData.append('pdfs', pdf)
        })
        
        // Add ZIPs
        media.zips.forEach(zip => {
          formData.append('zip_files', zip)
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
      toast.error('Upload failed: ' + error.message)
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
    // Updated to remove images
    setMedia({ videos: [], pdfs: [], zips: [], thumbnail: null })
    setPreviews({ videos: [], pdfs: [], zips: [], thumbnail: null })
    setUploadProgress({ stage: '', progress: 0 })
    setCollaborators([{ name: '', github: '' }])
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
        <UploadProgress uploadProgress={uploadProgress} uploading={uploading} />

        <form onSubmit={handleSubmit} className="p-6">
          {/* Project Information */}
          <ProjectInfoForm 
            projectData={projectData}
            setProjectData={setProjectData}
            categories={categories}
            loadingCategories={loadingCategories}
          />

          {/* Collaborators Section */}
          <CollaboratorsForm 
            collaborators={collaborators}
            setCollaborators={setCollaborators}
          />

          {/* Media Upload Section */}
          <MediaUpload 
            media={media}
            setMedia={setMedia}
            previews={previews}
            setPreviews={setPreviews}
          />

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
