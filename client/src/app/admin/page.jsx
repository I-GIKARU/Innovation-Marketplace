'use client'

import { useState } from 'react'
import Sidebar from '../../../components/AdminSidebar'
import Products from '../../../components/AdminProducts'
import Projects from '../../../components/AdminProjects'
import Dashboard from '../../../components/AdminDashboard'
import Navbar from '../../../components/AdminNavbar'

function AdminPage() {
  const [selectedPage, setSelectedPage] = useState('dashboard')

  const renderContent = () => {
    if (selectedPage === 'products') return <Products />
    if (selectedPage === 'projects') return <Projects />
    return <Dashboard />
  }

  return (
  <>
  <Navbar/>
    <div className="flex">
      <Sidebar onSelect={setSelectedPage} />
      
      <main className="ml-64 w-full min-h-screen bg-gray-100 p-6">
       
        {renderContent()}
      </main>
    </div>
    </>
  )
}

export default AdminPage