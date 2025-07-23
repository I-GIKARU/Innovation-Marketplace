'use client'

import { useState } from 'react'
import Sidebar from '../../../../components/admin/AdminSidebar'
import Products from '../../../../components/admin/AdminProducts'
import Projects from '../../../../components/admin/AdminProjects'
import Dashboard from '../../../../components/admin/AdminDashboard'
import Navbar from '../../../../components/admin/AdminNavbar'

function AdminPage() {
  const [selectedPage, setSelectedPage] = useState('dashboard')

  const renderContent = () => {
    if (selectedPage === 'products') return <Products />
    if (selectedPage === 'projects') return <Projects />
    return <Dashboard />
  }

  return (
  <>

  <Dashboard/>
    </>
  )
}

export default AdminPage