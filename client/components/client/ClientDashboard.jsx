import React, { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import ClientSidebar from './ClientSidebar'
import DashboardOverview from './DashboardOverview'
import MyOrders from './MyOrders'
import ClientProfile from './ClientProfile'
import ClientContributions from './ClientContributions'
import { useClientDashboard } from '@/hooks/useClientDashboard'
import { useAuthContext } from "@/contexts/AuthContext";

const ClientDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const { dashboardData, allData, loading, error, fetchAllClientData, refreshData } = useClientDashboard()
  const { user } = useAuthContext()

  // Fetch dashboard data when component mounts
  useEffect(() => {
    if (user && user.role === 'client') {
      fetchAllClientData()
    }
  }, [user, fetchAllClientData])

  const handleSidebarSelect = (section) => {
    setActiveSection(section)
  }

  const handleOrderUpdate = () => {
    refreshData('orders') // Refresh orders data
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardOverview 
              dashboardData={dashboardData} 
              loading={loading}
              error={error}
              onRetry={fetchAllClientData}
            />
          </div>
        )
      case 'orders':
        return (
          <MyOrders 
            orders={allData.orders} 
            loading={loading && !allData.orders.length} 
            onOrderUpdate={handleOrderUpdate}
          />
        )
      case 'contributions':
        return <ClientContributions contributions={allData.contributions} loading={loading && !allData.contributions.length} onRefresh={() => refreshData('contributions')} />
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
      <div className="flex flex-1 overflow-hidden">
        <ClientSidebar onSelect={handleSidebarSelect} />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-2 py-2 sm:px-4 sm:py-4 md:p-6 bg-gray-50 w-full">
            <div className="max-w-full mx-auto">
              {renderActiveSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientDashboard
