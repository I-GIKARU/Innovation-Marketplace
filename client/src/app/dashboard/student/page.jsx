'use client'


import StudentDashboard from "@/components/student/StudentDashboard";
import AuthGuard from '@/components/auth/AuthGuard'

function StudentPage() {
  return (
    <AuthGuard requiredRole="student">
      <StudentDashboard />
    </AuthGuard>
  )
}

export default StudentPage
