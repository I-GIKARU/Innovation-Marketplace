"use client"
import React from 'react'
import { CheckCircle, Clock, XCircle } from 'lucide-react'

const ProjectStatusIcon = ({ status }) => {
  switch (status) {
    case 'approved':
      return <CheckCircle size={16} className="text-green-600" />
    case 'pending':
      return <Clock size={16} className="text-yellow-600" />
    case 'rejected':
      return <XCircle size={16} className="text-red-600" />
    default:
      return <Clock size={16} className="text-gray-600" />
  }
}

export default ProjectStatusIcon
