"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import ProjectCard from "@/components/ProjectCard";
import SkillsPanel from "@/components/SkillsPanel";
import { Search, Plus, LogOut } from "lucide-react";

export default function StudentDashboard() {
  const { user, logout } = useAuth("student");
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/projects`
        );
        const data = await res.json();
        setProjects(data.projects);
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleAddProject = () => {
    // Replace this with modal or routing to add form
    alert("Add Project button clicked!");
  };

  const handleLogout = () => {
    logout();
  };

  const filteredProjects = projects.filter((proj) =>
    proj.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return <p>Loading student dashboard...</p>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 px-4 py-6 md:p-6">
        {/* Topbar */}
        <div className="sticky top-0 z-10 bg-white rounded-xl shadow-md px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full w-full sm:w-1/2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search projects..."
              className="bg-transparent outline-none flex-1 text-sm"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddProject}
              className="bg-black text-white p-2 rounded-full hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 hover:scale-105 transition-transform"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, Student</h1>
          <p className="text-sm text-gray-600 mt-1">Email: {user.email}</p>
        </div>

        {/* Projects and Skills */}
        <div className="flex flex-col xl:flex-row gap-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {loading ? (
              <p className="text-center text-gray-500 col-span-full">
                Loading projects...
              </p>
            ) : filteredProjects.length === 0 ? (
              <p className="text-center text-gray-500 col-span-full">
                No matching projects found.
              </p>
            ) : (
              filteredProjects.map((proj, idx) => (
                <ProjectCard
                  key={idx}
                  title={proj.title}
                  description={proj.description}
                  image="/images/default.jpg"
                  bgColor="bg-gray-100"
                />
              ))
            )}
          </div>

          <div className="min-w-[250px]">
            <SkillsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
