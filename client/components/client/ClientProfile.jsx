'use client'

import React, { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Save, Edit2, Camera, Shield, Bell, CreditCard } from 'lucide-react'
import { useAuthContext } from "@/contexts/AuthContext";

const ClientProfile = ({ dashboardData }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { authFetch, user } = useAuthContext()
  
  // Initialize user data from auth context or dashboard data
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

  // Fetch user profile data on component mount
  useEffect(() => {
    fetchUserProfile()
  }, [])

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

  const [formData, setFormData] = useState({
    email: userData.email,
    phone: userData.phone,
    bio: userData.bio,
    socials: userData.socials,
    company: userData.company,
    past_projects: userData.past_projects
  })

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


  const tabs = [
    { id: 'profile', label: 'Profile', icon: User }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-20 h-20 rounded-full object-cover"
            />
            <button className="absolute bottom-0 right-0 p-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{userData.email}</h2>
            <p className="text-gray-600 capitalize">{userData.role} Account</p>
            <p className="text-sm text-gray-500">Member since {new Date(userData.joinDate).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {dashboardData?.stats?.totalOrders || 0}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
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
                      className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <p className="text-gray-900 capitalize">{userData.role}</p>
                  <p className="text-xs text-gray-500 mt-1">Your account role</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your company name"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.company || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.socials}
                      onChange={(e) => setFormData(prev => ({ ...prev, socials: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your social media links"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.socials || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900">{userData.bio || 'No bio provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Past Projects</label>
                {isEditing ? (
                  <textarea
                    value={formData.past_projects}
                    onChange={(e) => setFormData(prev => ({ ...prev, past_projects: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe your past projects and experience..."
                  />
                ) : (
                  <p className="text-gray-900">{userData.past_projects || 'No past projects listed'}</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default ClientProfile
