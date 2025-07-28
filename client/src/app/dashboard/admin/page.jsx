'use client'

import Dashboard from '../../../../components/admin/AdminDashboard'
import AuthGuard from '@/components/auth/AuthGuard'

function AdminPage() {
  return (
    <AuthGuard requiredRole="admin">
      <Dashboard/>
    </AuthGuard>
  )
}

export default AdminPage
