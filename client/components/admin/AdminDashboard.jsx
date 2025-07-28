import React, { useState } from 'react'
import NavBar from '@/components/NavBar'
import Sidebar from './AdminSidebar'
import OverviewPage from './Overview'
import ProductsManagement from './ProductsManagement'
import ProjectsManagement from './ProjectsManagement'
import AdminCVManagement from './AdminCVManagement'
import OrdersManagement from './orders/OrdersManagement'
import CategoriesManagement from './CategoriesManagement'

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard')

  const handleSidebarSelect = (section) => {
    setActiveSection(section)
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <OverviewPage />
          </div>
        )
      case 'products':
        return <ProductsManagement />
      case 'projects':
        return <ProjectsManagement />
      case 'cvs':
        return <AdminCVManagement />
      case 'orders':
        return <OrdersManagement />
      case 'categories':
        return <CategoriesManagement />
      default:
        return (
          <div className="space-y-6">
            <OverviewPage />
          </div>
        )
    }
  }

  return (
    <div className="h-screen w-full flex flex-col m-0 p-0">
      <NavBar />
      <div className="flex flex-1">
        <Sidebar onSelect={handleSidebarSelect} />
        <div className="flex flex-col flex-1">
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {renderActiveSection()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
