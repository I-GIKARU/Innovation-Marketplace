import React, { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import StudentSidebar from './StudentSidebar'
import DashboardOverview from './DashboardOverview'
import MyProjectsPanel from './MyProjectsPanel'
import ProjectUpload from './ProjectUpload'
import StudentReviews from './StudentReviews'
import StudentProfile from './StudentProfile'
import CVUpload from './CVUpload'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { useAuthContext } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCVUploadModal, setShowCVUploadModal] = useState(false)
  const { dashboardData, loading: dashboardLoading, error, fetchDashboardData } = useStudentDashboard()
  const { user } = useAuthContext()

  // Fetch dashboard data when component mounts
  useEffect(() => {
    if (user && user.role === 'student') {
      fetchDashboardData()
    }
  }, [user, fetchDashboardData])

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
          <div className="space-y-6 p-6">
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
      <div className="flex flex-1">
        <StudentSidebar onSelect={handleSidebarSelect} />
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {renderActiveSection()}
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
