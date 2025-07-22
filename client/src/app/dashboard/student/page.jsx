"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/student/Sidebar";
import SkillsPanel from "@/components/student/SkillsPanel";
import ProjectUpload from "@/components/student/ProjectUpload";
import MyProjectsPanel from "@/components/student/MyProjectsPanel";
import { Search, Plus, LogOut } from "lucide-react";

export default function StudentDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Redirect non-students or unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (!authLoading && user && user.role !== 'student') {
      router.push('/'); // Redirect non-students to home
    }
  }, [authLoading, user, router]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleAddProject = () => {
    setShowUploadModal(true);
  };

  const handleUploadComplete = (newProject) => {
    // Add new project to the list or refresh the list
    setProjects(prev => [newProject, ...prev]);
    setShowUploadModal(false);
  };

  const handleLogout = () => {
    alert("Logging out...");
    logout();
  };

  const filteredProjects = projects.filter((proj) =>
    proj.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated or not a student
  if (!user || user.role !== 'student') {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        {/* Topbar */}
        <div className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full w-1/2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search projects..."
              className="bg-gray-100 outline-none flex-1 text-sm"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddProject}
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800"
            >
              <Plus className="w-5 h-5" />
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mb-4 p-4 bg-blue-50 rounded shadow">
          <h1 className="text-xl font-bold">Welcome, Student</h1>
          <p className="text-gray-700">Email: {user.email}</p>
        </div>

        {/* My Projects and Skills */}
        <div className="flex gap-6 mt-6">
          <div className="flex-1">
            <MyProjectsPanel />
          </div>
          <div className="w-80">
            <SkillsPanel />
          </div>
        </div>
      </div>
      
      {/* Project Upload Modal */}
      {showUploadModal && (
        <ProjectUpload
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUploadComplete={handleUploadComplete}
        />
      )}
    </div>
  );
}
