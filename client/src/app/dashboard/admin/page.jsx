"use client";

import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";
import { useState } from 'react'
import Sidebar from '../../../components/AdminSidebar'
import Products from '../../../components/AdminProducts'
import Projects from '../../../components/AdminProjects'
import Dashboard from '../../../components/AdminDashboard'
import Navbar from '../../../components/AdminNavbar'


 function AdminDashboard() {
    
    const { user } = useAuth();
    const [selectedPage, setSelectedPage] = useState('dashboard')
    const renderContent = () => {
    if (selectedPage === 'products') return <Products />
    if (selectedPage === 'projects') return <Projects />
    return <Dashboard />
  }

    if (!user) return <p>Loading...</p>;

    return (
        <>
        <Navbar/>
        <div className="flex">
            <Sidebar/>
            <main className="flex-1 p-6">
                <div className="mb-6 p-4 bg-blue-100 rounded shadow">
                    <h1 className="text-2xl font-semibold">
                        Welcome, {user.name || "Admin"}!
                    </h1>
                    <p className="text-gray-700">Email: {user.email}</p>
                </div>

                {/* Additional Admin Dashboard Content */}
                <h2 className="text-lg font-bold mb-2">Admin Dashboard</h2>
                <p>Start managing your system here...</p>
            </main>
        </div>
        </>
    );
}
export default AdminDashboard