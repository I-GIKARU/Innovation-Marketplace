'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { User, Mail, Phone, Save, Edit2, Camera } from 'lucide-react'

const StudentProfile = ({ dashboardData }) => {
  const { authFetch, user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Initialize user data from auth context
  const [userData, setUserData] = useState({
    id: user?.id || '',
    email: user?.email || '',
    role: user?.role || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    socials: user?.socials || '',
    company: user?.company || '',
    past_projects: user?.past_projects || '',
    joinDate: user?.created_at || new Date().toISOString(),
    avatar: '/placeholder-avatar.jpg'
  })

  const [formData, setFormData] = useState({
    email: userData.email,
    phone: userData.phone,
    bio: userData.bio,
    socials: userData.socials,
    company: userData.company,
    past_projects: userData.past_projects
  })

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile()
  }, [])

  // Update form data when userData changes
  useEffect(() => {
    setFormData({
      email: userData.email,
      phone: userData.phone,
      bio: userData.bio,
      socials: userData.socials,
      company: userData.company,
      past_projects: userData.past_projects
    })
  }, [userData])

  const fetchUserProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const profileData = await authFetch('/auth/profile')
      if (profileData.user) {
        setUserData(prev => ({
          ...prev,
          id: profileData.user.id || prev.id,
          email: profileData.user.email || prev.email,
          role: profileData.user.role || prev.role,
          phone: profileData.user.phone || prev.phone,
          bio: profileData.user.bio || prev.bio,
          socials: profileData.user.socials || prev.socials,
          company: profileData.user.company || prev.company,
          past_projects: profileData.user.past_projects || prev.past_projects
        }))
      }
    } catch (err) {
      setError('Failed to fetch profile data')
      console.error('Profile fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    setError(null)
    try {
      const updatedProfile = await authFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(formData)
      })
      
      setUserData(prev => ({
        ...prev,
        ...formData,
        ...updatedProfile
      }))
      setIsEditing(false)
    } catch (err) {
      setError('Failed to update profile')
      console.error('Profile update error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      email: userData.email,
      phone: userData.phone,
      bio: userData.bio,
      socials: userData.socials,
      company: userData.company,
      past_projects: userData.past_projects
    })
    setIsEditing(false)
  }

  const getProjectStats = () => {
    if (!dashboardData?.projects) return { total: 0, approved: 0, pending: 0, featured: 0 }
    
    const projects = dashboardData.projects
    return {
      total: projects.length,
      approved: projects.filter(p => p.status === 'approved').length,
      pending: projects.filter(p => p.status === 'pending').length,
      featured: projects.filter(p => p.featured).length
    }
  }

  const stats = getProjectStats()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
        <p className="text-gray-600">Manage your account information and preferences</p>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Picture and Basic Info */}
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 relative">
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <button className="absolute bottom-0 right-0 p-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
                    <Camera className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{userData.email}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 capitalize">{userData.role}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Member Since
                      </label>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{new Date(userData.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {userData.phone || 'Not provided'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your company/university"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {userData.company || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Social Links
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.socials}
                      onChange={(e) => setFormData(prev => ({ ...prev, socials: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="GitHub, LinkedIn, etc."
                    />
                  ) : (
                    <p className="text-gray-900">
                      {userData.socials || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-900">
                      {userData.bio || 'No bio provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Past Projects Experience
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.past_projects}
                      onChange={(e) => setFormData(prev => ({ ...prev, past_projects: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe your previous projects and experience..."
                    />
                  ) : (
                    <p className="text-gray-900">
                      {userData.past_projects || 'No past projects listed'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default StudentProfile
