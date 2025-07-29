import React, { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import ClientSidebar from './ClientSidebar'
import DashboardOverview from './DashboardOverview'
import MyOrders from './MyOrders'
import ClientProfile from './ClientProfile'
import { useClientDashboard } from '@/hooks/useClientDashboard'
import { useAuth } from '@/hooks/useAuth'

const ClientDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const { dashboardData, loading: dashboardLoading, error, fetchDashboardData } = useClientDashboard()
  const { user } = useAuth()

  // Fetch dashboard data when component mounts
  useEffect(() => {
    if (user && user.role === 'client') {
      fetchDashboardData()
    }
  }, [user, fetchDashboardData])

  const handleSidebarSelect = (section) => {
    setActiveSection(section)
  }

  const handleOrderUpdate = () => {
    fetchDashboardData() // Refresh dashboard data when orders are updated
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
            />
          </div>
        )
      case 'orders':
        return (
          <MyOrders 
            orders={dashboardData?.orders || []} 
            loading={dashboardLoading} 
            onOrderUpdate={handleOrderUpdate}
          />
        )
      case 'profile':
        return <ClientProfile dashboardData={dashboardData} />
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
        <ClientSidebar onSelect={handleSidebarSelect} />
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto bg-gray-50">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
