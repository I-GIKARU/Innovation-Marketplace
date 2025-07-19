import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ProjectCard from "@/components/ProjectCard";
import SkillsPanel from "@/components/SkillsPanel";

export default function StudentDashboard() {
  const { user, logout } = useAuth("student");
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (!user) return <p>Loading student dashboard...</p>;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <Topbar />

        <div className="mb-4 p-4 bg-blue-50 rounded shadow">
          <h1 className="text-xl font-bold">Welcome, Student</h1>
          <p className="text-gray-700">Email: {user.email}</p>
        </div>

        <div className="flex gap-4 mt-6">
          <div className="grid grid-cols-2 gap-4 flex-1">
            {loading ? (
              <p>Loading projects...</p>
            ) : (
              projects.map((proj, idx) => (
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
