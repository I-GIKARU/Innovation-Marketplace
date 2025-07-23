"use client";

import { FiEye, FiDownload, FiGithub, FiExternalLink, FiUser, FiCode } from "react-icons/fi";
import { Users } from "lucide-react";
import { getTeamMembers } from "@/utils/projectHelpers";

const ProjectSidebar = ({ project, isEditing, editedTechStack, onTechStackChange }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getTechStackArray = (techStack) => {
    if (!techStack) return [];
    return techStack.split(',').map(tech => tech.trim()).filter(Boolean);
  };

  // Get correct team members count
  const getTeamMembersCount = (project) => {
    const registeredMembers = project?.user_projects?.filter(
      (up) => up.interested_in === "contributor" && up.user
    ) || [];
    
    let externalMembers = [];
    if (project?.external_collaborators) {
      try {
        externalMembers = typeof project.external_collaborators === 'string' 
          ? JSON.parse(project.external_collaborators)
          : project.external_collaborators;
      } catch (e) {
        externalMembers = [];
      }
    }
    
    return registeredMembers.length + (externalMembers?.length || 0);
  };

  return (
    <div className="space-y-4">
      {/* For Sale Indicator */}
      {project.is_for_sale && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-sm p-4 text-white">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">💰</span>
            <div className="text-center">
              <h3 className="font-semibold">Available for Purchase</h3>
              <p className="text-sm text-green-100">Contact the team for pricing</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Project Stats */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold mb-3">Project Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-600">
              <FiEye className="w-4 h-4 mr-2" />
              Views
            </span>
            <span className="font-medium">{project.views || 0}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-600">
              <FiDownload className="w-4 h-4 mr-2" />
              Downloads
            </span>
            <span className="font-medium">{project.downloads || 0}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              Contributors
            </span>
            <span className="font-medium">
              {getTeamMembersCount(project)}
            </span>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      {(project.tech_stack || isEditing) && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-lg font-semibold mb-3">
            <FiCode className="inline w-5 h-5 mr-2" />
            Tech Stack
          </h3>
          
          {isEditing ? (
            <textarea
              className="w-full p-3 border rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={editedTechStack}
              onChange={(e) => onTechStackChange(e.target.value)}
              rows={3}
              placeholder="Enter technologies separated by commas..."
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {getTechStackArray(project.tech_stack).map((tech, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Technical Mentor */}
      {project.technical_mentor && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-lg font-semibold mb-2">
            <FiUser className="inline w-5 h-5 mr-2" />
            Technical Mentor
          </h3>
          <p className="text-gray-700">{project.technical_mentor}</p>
        </div>
      )}

      {/* Project Links */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="text-lg font-semibold mb-3">Project Links</h3>
        <div className="space-y-3">
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <FiGithub className="w-5 h-5 mr-3" />
              View Source Code
            </a>
          )}
          
          {project.demo_link && (
            <a
              href={project.demo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiExternalLink className="w-5 h-5 mr-3" />
              Live Demo
            </a>
          )}
        </div>
      </div>

    </div>
  );
};

export default ProjectSidebar;
