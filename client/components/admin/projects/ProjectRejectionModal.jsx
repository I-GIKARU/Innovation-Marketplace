"use client"
import React, { useState } from 'react'
import Modal from '../shared/Modal'
import LoadingSpinner from '../shared/LoadingSpinner'

const ProjectRejectionModal = ({ 
  isOpen, 
  onClose, 
  project, 
  onReject, 
  isLoading 
}) => {
  const [rejectionReason, setRejectionReason] = useState('')

  const handleReject = () => {
    onReject(rejectionReason.trim() || 'Project rejected without specific reason')
  }

  const handleClose = () => {
    setRejectionReason('')
    onClose()
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Reject Project"
      maxWidth="max-w-md"
    >
      <div className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            You are about to reject the project:
          </p>
          <p className="font-medium text-gray-900">
            "{project?.title}"
          </p>
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="rejectionReason" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Reason for rejection (optional)
          </label>
          <textarea
            id="rejectionReason"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            rows={4}
            placeholder="Please provide a reason for rejecting this project. This will help the student understand what needs to be improved."
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReject}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size={16} className="border-white border-t-transparent mr-2" />
                Rejecting...
              </>
            ) : (
              'Reject Project'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ProjectRejectionModal
