"use client";

import { useState } from "react";
import { FiEye } from "react-icons/fi";
import { Users, Sparkles, MessageSquare } from "lucide-react";
import { getTeamMembers } from "@/utils/projectHelpers";
import BuyMeCoffee from "./BuyMeCoffee";

const ProjectSidebar = ({ project, isEditing, editedTechStack, onTechStackChange, onAskAI }) => {
  const [showBuyMeCoffee, setShowBuyMeCoffee] = useState(false);
  
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

      {/* AI Project Summary */}
      {project.project_summary && (
        <div className="bg-gradient-to-r from-purple-500/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl border border-purple-400/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              AI Project Summary
            </h3>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
              {project.project_summary}
            </p>
          </div>
          {project.documentation_file_id && (
            <div className="mt-3 flex items-center text-xs text-purple-300">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Enhanced with project documentation</span>
            </div>
          )}
        </div>
      )}

      {/* Buy Me Coffee */}
      <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 backdrop-blur-sm rounded-2xl p-6 text-white">
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">☕</span>
          <div className="text-center">
            <h3 className="font-bold text-lg">Support the Project</h3>
            <p className="text-sm">Buy us a coffee</p>
            <button 
              onClick={() => setShowBuyMeCoffee(true)}
              className="inline-block mt-2 px-4 py-2 bg-black rounded-full text-white hover:bg-gray-800 transition-colors"
            >
              ☕ Buy Coffee
            </button>
          </div>
        </div>
      </div>

      {/* Buy Me Coffee Modal */}
      <BuyMeCoffee 
        project={project}
        isOpen={showBuyMeCoffee}
        onClose={() => setShowBuyMeCoffee(false)}
      />

      {/* Ask AI Section */}
      <div className="bg-gradient-to-r from-indigo-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-indigo-400/30 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            AI Assistant
          </h3>
        </div>
        <p className="text-gray-300 text-sm mb-4">
          Have questions about this project? Ask our AI assistant for detailed insights about the technologies, implementation, and features.
        </p>
        <button
          onClick={onAskAI}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <MessageSquare className="w-4 h-4" />
          Ask AI about this Project
        </button>
      </div>

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
