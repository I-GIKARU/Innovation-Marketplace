import React, { useState, useEffect, useCallback } from 'react'
import NavBar from '@/components/NavBar'
import StudentSidebar from './StudentSidebar'
import DashboardOverview from './DashboardOverview'
import MyProjectsPanel from './MyProjectsPanel'
import ProjectUpload from './ProjectUpload'
import StudentReviews from './StudentReviews'
import StudentProfile from './StudentProfile'
import CVUpload from './CVUpload'
import MyOrders from '@/components/client/MyOrders'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { useAuthContext } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCVUploadModal, setShowCVUploadModal] = useState(false)
  const { dashboardData, allData, loading: dashboardLoading, error, fetchDashboardData, fetchAllStudentData } = useStudentDashboard()
  const { user } = useAuthContext()

  // Fetch dashboard data when component mounts
  useEffect(() => {
    if (user && user.role === 'student') {
      fetchAllStudentData()
    }
  }, [user, fetchAllStudentData])

  const handleSidebarSelect = (section) => {
    setActiveSection(section)
    if (section === 'upload') {
      setShowUploadModal(true)
      setActiveSection('dashboard') // Keep dashboard active
    }
  }

  const handleUploadComplete = () => {
    setShowUploadModal(false)
    fetchDashboardData() // Refresh dashboard data
  }

  const handleCVUploadSuccess = () => {
    setShowCVUploadModal(false)
    fetchDashboardData() // Refresh dashboard data to show updated CV status
  }

  const handleProjectUpdate = () => {
    fetchDashboardData() // Refresh dashboard data when projects are updated
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardOverview 
              dashboardData={dashboardData} 
              loading={dashboardLoading}
              error={error}
              onRetry={fetchDashboardData}
              onCVUpload={() => setShowCVUploadModal(true)}
              onCVUpdate={fetchDashboardData}
            />
          </div>
        )
      case 'projects':
        return (
          <MyProjectsPanel 
            projects={dashboardData?.projects || []} 
            loading={dashboardLoading} 
            onProjectUpdate={handleProjectUpdate}
          />
        )
      case 'orders':
        return (
          <MyOrders 
            orders={allData.orders || []} 
            loading={dashboardLoading} 
            onOrderUpdate={() => {}}
          />
        )
      case 'reviews':
        return <StudentReviews dashboardData={dashboardData} />
      case 'profile':
        return <StudentProfile dashboardData={dashboardData} />
      default:
        return (
          <div className="space-y-6">
            <DashboardOverview dashboardData={dashboardData} />
          </div>
        )
    }
  }

  return (
    <div className="h-screen w-full flex flex-col m-0 p-0">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <StudentSidebar onSelect={handleSidebarSelect} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-2 py-2 sm:px-4 sm:py-4 md:p-6 bg-gray-50 w-full">
            <div className="max-w-full mx-auto">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <ProjectUpload
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}

      {/* CV Upload Modal */}
      {showCVUploadModal && (
        <CVUpload
          isOpen={showCVUploadModal}
          onClose={() => setShowCVUploadModal(false)}
          onUploadSuccess={handleCVUploadSuccess}
        />
      )}
    </div>
  )
}

export default StudentDashboard
