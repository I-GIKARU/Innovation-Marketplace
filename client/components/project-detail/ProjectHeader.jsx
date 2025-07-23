"use client";

import { useRouter } from "next/navigation";
import { FiStar } from "react-icons/fi";

const ProjectHeader = ({ project }) => {
  const router = useRouter();

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button 
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-4 flex items-center gap-2"
        >
          ← Back to Projects
        </button>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {project.title}
        </h1>
        
        <div className="flex items-center gap-3 mb-4">
          {project.category?.name && (
            <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
              {project.category.name}
            </span>
          )}
          
          {project.featured && (
            <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full flex items-center gap-1">
              <FiStar className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
