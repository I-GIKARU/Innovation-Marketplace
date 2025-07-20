import React, { useEffect } from 'react';
import { useProjects } from '@/hooks/useProjects'; // adjust path as needed

const ProjectsTable = () => {
  const {
    projects,
    fetchProjects,
    loading,
    error,
  } = useProjects();

  useEffect(() => {
    fetchProjects(); // Fetch data on mount
  }, [fetchProjects]);

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
          </tr>
          </thead>
          <tbody>
          {projects.map((project, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">
                  {project.student_name || 'N/A'}
                </td>
                <td className="px-4 py-2">
                  {project.title || 'Untitled'}
                </td>
                <td
                    className={`px-4 py-2 font-medium ${
                        project.status === 'Approved'
                            ? 'text-green-600'
                            : project.status === 'Pending'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                    }`}
                >
                  {project.status || 'Unknown'}
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
};

export default ProjectsTable;
