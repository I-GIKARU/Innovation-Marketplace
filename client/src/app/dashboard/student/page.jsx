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
    alert("Add Project button clicked!");
  };

  const handleLogout = () => {
    alert("Logging out...");
    logout();
  };

  const filteredProjects = projects.filter((proj) =>
    proj.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) return <p>Loading student dashboard...</p>;

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

        {/* Projects and Skills */}
        <div className="flex gap-4 mt-6">
          <div className="grid grid-cols-2 gap-4 flex-1">
            {loading ? (
              <p>Loading projects...</p>
            ) : filteredProjects.length === 0 ? (
              <p>No matching projects found.</p>
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
          <SkillsPanel />
        </div>
      </div>
    </div>
  );
}
