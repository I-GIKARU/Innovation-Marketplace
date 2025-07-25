"use client";

import { FiEye } from "react-icons/fi";
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
    <div className="space-y-6">
      {/* For Sale Indicator */}
      {project.is_for_sale && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl border border-green-400/30 p-6 text-white">
          <div className="flex items-center justify-center gap-3">
            <span className="text-3xl">💰</span>
            <div className="text-center">
              <h3 className="font-bold text-lg">Available for Purchase</h3>
              <p className="text-sm text-green-200">Contact the team for pricing</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Project Stats */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Project Stats</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-300">
              <FiEye className="w-5 h-5 mr-3 text-orange-400" />
              Views
            </span>
            <span className="font-semibold text-white text-lg">{project.views || 0}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="flex items-center text-gray-300">
              <Users className="w-5 h-5 mr-3 text-orange-400" />
              Contributors
            </span>
            <span className="font-semibold text-white text-lg">
              {getTeamMembersCount(project)}
            </span>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      {(project.tech_stack || isEditing) && (
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Tech Stack
            </h3>
          </div>
          
          {isEditing ? (
            <textarea
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm"
              value={editedTechStack}
              onChange={(e) => onTechStackChange(e.target.value)}
              rows={4}
              placeholder="Enter technologies separated by commas..."
            />
          ) : (
            <div className="flex flex-wrap gap-2">
              {getTechStackArray(project.tech_stack).map((tech, index) => (
                <span
                  key={index}
                  className="bg-orange-500/20 text-orange-200 border border-orange-400/30 px-3 py-2 rounded-xl text-sm font-medium"
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
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Technical Mentor
            </h3>
          </div>
          <p className="text-gray-200 text-lg">{project.technical_mentor}</p>
        </div>
      )}


    </div>
  );
};

export default ProjectSidebar;
