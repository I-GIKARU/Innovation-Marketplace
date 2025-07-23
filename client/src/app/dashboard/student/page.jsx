"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Plus, ShoppingCart } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/student/Sidebar";
import ProjectCard from "@/components/ProjectCard";
import ProjectUpload from "@/components/student/ProjectUpload";
import MyProjectsPanel from "@/components/student/MyProjectsPanel";

export default function StudentDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    } else if (!authLoading && user && user.role !== "student") {
      router.push("/");
    }
  }, [authLoading, user, router]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleAddProject = () => {
    setShowUploadModal(true);
  };

  const handleUploadComplete = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
    setShowUploadModal(false);
  };

  const handleAddToCart = (project) => {
    alert(`Added ${project.title} to cart!`);
  };

  const filteredProjects = projects.filter((proj) =>
    proj.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (!user || user.role !== "student") {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 p-4 overflow-auto">
        {/* Sticky topbar */}
        <div className="sticky top-0 z-10 bg-white p-4 shadow-md rounded-lg mb-6 flex items-center justify-between gap-4">
          {/* Search input */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full w-full md:w-1/2 transition-all duration-200">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search projects..."
              className="bg-gray-100 outline-none flex-1 text-sm"
            />
          </div>

          {/* + Button */}
          <button
            onClick={handleAddProject}
            className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-transform hover:scale-105"
            title="Add Project"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Welcome Message */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-blue-800">Welcome, Student</h1>
          <p className="text-gray-700 text-sm">Email: {user.email}</p>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          {/* My Projects */}
          <div className="w-full lg:w-1/2">
            <MyProjectsPanel />
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-1/2">
            {authLoading ? (
              <p>Loading projects...</p>
            ) : filteredProjects.length === 0 ? (
              <p>No matching projects found.</p>
            ) : (
              filteredProjects.map((proj, idx) => (
                <ProjectCard
                  key={idx}
                  project={proj}
                  title={proj.title}
                  description={proj.description}
                  image="/images/default.jpg"
                  bgColor="bg-white hover:bg-gray-50 transition-colors duration-300"
                  onAddToCart={() => handleAddToCart(proj)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
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
