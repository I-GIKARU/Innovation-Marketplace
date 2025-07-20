import React, { useState } from 'react';
import ProjectsTable from './AdminProjectsTable';

const Projects = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <section className="bg-white p-6 rounded shadow-md">
      <h2 className="text-xl font-bold mb-2">Projects</h2>
      <p className="text-gray-600">Student-led initiatives across various fields.</p>

      <button onClick={() => setShowDetails(!showDetails)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition" >
        View Details
      </button>

      {showDetails && <ProjectsTable />}
    </section>
  );
};

export default Projects;
