"use client";
import React, { useEffect } from "react";
import { useProjects } from "@/hooks/useProjects";

const ProjectsTable = ({ query }) => {
  const { projects, fetchProjects, loading, error } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleApprove = async (projectId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/projects${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Project approved!");
        fetchProjects();
      } else {
        alert(data.error || "Error approving project");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const handleReject = async (projectId) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/projects${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reason: "Not eligible" }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Project rejected!");
        fetchProjects();
      } else {
        alert(data.error || "Error rejecting project");
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  if (loading) return <p>Loading projects...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Student</th>
            <th className="px-4 py-2">Project</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((project, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{project.student_name || "N/A"}</td>
              <td className="px-4 py-2">{project.title || "Untitled"}</td>
              <td
                className={`px-4 py-2 font-medium ${
                  project.status === "approved"
                    ? "text-green-600"
                    : project.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {project.status}
              </td>
              <td className="px-4 py-2 space-x-2">
                {project.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(project.id)}
                      className="px-2 py-1 text-white bg-green-600 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(project.id)}
                      className="px-2 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
