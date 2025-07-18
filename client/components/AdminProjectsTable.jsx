
import React from 'react';

const ProjectsTable = () => {
  const projectData = [
    { name: "Michael Obiro", project: "Food Court", status: "Approved" },
    { name: "John Chege", project: "Health Hub", status: "Pending" },
    { name: "Natalie Shan", project: "Ecommerce", status: "Approved" },
    { name: "Ann Gathe", project: "Tours & Travel", status: "Rejected" },
  ];

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Project</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {projectData.map((item, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{item.name}</td>
              <td className="px-4 py-2">{item.project}</td>
              <td
                className={`px-4 py-2 font-medium ${
                  item.status === 'Approved'
                    ? 'text-green-600'
                    : item.status === 'Pending'
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {item.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
