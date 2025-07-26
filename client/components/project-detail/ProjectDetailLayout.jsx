"use client";

import ProjectMedia from "./ProjectMedia";
import ProjectDescription from "./ProjectDescription";
import ProjectSidebar from "./ProjectSidebar";
import ProjectTeamAndReviews from "./ProjectTeamAndReviews";

const ProjectDetailLayout = ({
  project,
  projectImages,
  projectVideos,
  projectPDFs,
  projectZIPs,
  teamMembers,
  projectReviews,
  isEditing,
  editedDescription,
  editedTechStack,
  canWriteReview,
  onDescriptionChange,
  onTechStackChange,
  onWriteReview,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1128] via-slate-900 to-[#0a1128]">
      {/* Main Content */}
      <div className="relative">
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-orange-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-orange-400 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-orange-300 rounded-full opacity-25 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-orange-500 rounded-full opacity-20 animate-bounce" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Compact Project Title */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              {project.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              {project.category?.name && (
                <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-lg">
                  {project.category.name}
                </span>
              )}
              {project.featured && (
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col xl:grid xl:grid-cols-4 gap-12">
            
            {/* Left Column - Main Content */}
            <div className="xl:col-span-3 space-y-16 order-1">
              
              {/* Project Media Section */}
              <section className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Project Media Gallery
                  </h2>
                </div>
                <ProjectMedia 
                  project={project}
                  projectImages={projectImages}
                  projectVideos={projectVideos}
                  projectPDFs={projectPDFs}
                  projectZIPs={projectZIPs}
                />
              </section>

              {/* Description Section */}
              <section className="relative">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <ProjectDescription 
                    project={project}
                    isEditing={isEditing}
                    editedDescription={editedDescription}
                    onDescriptionChange={onDescriptionChange}
                  />
                </div>
              </section>

              {/* Team and Reviews Section */}
              <section className="relative">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <ProjectTeamAndReviews 
                    project={project}
                    teamMembers={teamMembers}
                    projectReviews={projectReviews}
                    canWriteReview={canWriteReview}
                    onWriteReview={onWriteReview}
                  />
                </div>
              </section>
            </div>

            {/* Right Column - Sidebar */}
            <div className="xl:col-span-1 space-y-6 order-2">
              <div className="xl:sticky xl:top-8">
                <ProjectSidebar
                  project={project}
                  isEditing={isEditing}
                  editedTechStack={editedTechStack}
                  onTechStackChange={onTechStackChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailLayout;
