import React, { useState, useEffect } from 'react'
import NavBar from '@/components/NavBar'
import Sidebar from './AdminSidebar'
import OverviewPage from './Overview'
import ProductsManagement from './ProductsManagement'
import ProjectsManagement from './ProjectsManagement'
import AdminCVManagement from './AdminCVManagement'
import OrdersManagement from './orders/OrdersManagement'
import CategoriesManagement from './CategoriesManagement'
import AdminContributionsManagement from './AdminContributionsManagement'
import { useAdminDashboard } from '@/hooks/useAdminDashboard'

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard')
  const {
    dashboardData,
    allData,
    loading,
    error,
    fetchAllAdminData,
    refreshData,
  } = useAdminDashboard()

  useEffect(() => {
    fetchAllAdminData()
  }, [fetchAllAdminData])

  const handleSidebarSelect = (section) => {
    setActiveSection(section)
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <OverviewPage
              dashboardData={dashboardData}
              loading={loading}
              error={error}
              onRetry={fetchAllAdminData}
            />
          </div>
        )
      case 'products':
        return (
          <ProductsManagement
            products={allData.products}
            loading={loading && !allData.products.length}
            error={error}
            onRefresh={() => refreshData('products')}
          />
        )
      case 'projects':
        return (
          <ProjectsManagement
            projects={allData.projects}
            loading={loading && !allData.projects.length}
            error={error}
            onRefresh={() => refreshData('projects')}
          />
        )
      case 'cvs':
        return (
          <AdminCVManagement
            cvs={allData.cvs}
            loading={loading && !allData.cvs.length}
            error={error}
            onRefresh={() => refreshData('cvs')}
          />
        )
      case 'orders':
        return (
          <OrdersManagement
            orders={allData.orders}
            loading={loading && !allData.orders.length}
            error={error}
            onRefresh={() => refreshData('orders')}
          />
        )
      case 'categories':
        return (
          <CategoriesManagement
            categories={allData.categories}
            loading={loading && !allData.categories.length}
            error={error}
            onRefresh={() => refreshData('categories')}
          />
        )
      case 'contributions':
        return (
          <AdminContributionsManagement
            contributions={allData.contributions}
            loading={loading && !allData.contributions.length}
            error={error}
            onRefresh={() => refreshData('contributions')}
          />
        )
      default:
        return (
          <div className="space-y-6">
            <OverviewPage
              dashboardData={dashboardData}
              loading={loading}
              error={error}
              onRetry={fetchAllAdminData}
            />
          </div>
        )
    }
  }

  return (
    <div className="h-screen w-full flex flex-col m-0 p-0">
      <NavBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onSelect={handleSidebarSelect} />
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

export default AdminDashboard
