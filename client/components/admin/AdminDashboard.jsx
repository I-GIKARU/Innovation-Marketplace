import React from 'react'
import Navbar from './AdminNavbar'
import Sidebar from './AdminSidebar'
import AdminChart from './AdminChart'
import OverviewPage from './Overview'

const AdminDashboard = () => {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <OverviewPage />
          <AdminChart />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
