import React, { useState, useEffect } from 'react'
import { EnvelopeIcon, CalendarIcon, UserIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'

const StudentMessages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchHireRequests()
  }, [])

  const fetchHireRequests = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user-projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch hire requests')
      }

      const data = await response.json()
      
      // Filter for hire requests (where user_id is null and interested_in is 'hire_request')
      const hireRequests = (data.user_projects || []).filter(item => 
        item.interested_in === 'hire_request' && 
        item.user_id === null
      )
      
      setMessages(hireRequests)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading messages</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={fetchHireRequests}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <EnvelopeIcon className="h-6 w-6 mr-2 text-blue-500" />
          Hire Requests
        </h1>
        <p className="text-gray-600 mt-1">
          Messages from people interested in hiring your team
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hire requests</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't received any hire requests yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id || index}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2 mr-3">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {message.email || 'Unknown Sender'}
                    </h3>
                    <p className="text-sm text-gray-500">Hire Request</p>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {formatDate(message.created_at)}
                </div>
              </div>

              {message.project && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center text-sm text-gray-700">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    <span className="font-medium">Project:</span>
                    <span className="ml-1">{message.project.title}</span>
                  </div>
                </div>
              )}

              {message.message && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {message.message}
                  </p>
                </div>
              )}

              {message.company && (
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Company:</span> {message.company}
                </div>
              )}

              {message.phone && (
                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Phone:</span> {message.phone}
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={() => window.location.href = `mailto:${message.email}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Reply via Email
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StudentMessages
