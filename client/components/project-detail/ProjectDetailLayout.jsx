"use client";

import ProjectHeader from "./ProjectHeader";
import ProjectMedia from "./ProjectMedia";
import ProjectDescription from "./ProjectDescription";
import ProjectSidebar from "./ProjectSidebar";
import ProjectActions from "./ProjectActions";
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
  canEditOrDelete,
  canExpressInterest,
  canWriteReview,
  onDescriptionChange,
  onTechStackChange,
  onDownload,
  onEdit,
  onSave,
  onDelete,
  onExpressInterest,
  onWriteReview,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <ProjectHeader project={project} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Left Column - Main Content */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Project Overview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Media Section */}
              <div className="p-6 pb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Media</h2>
                <ProjectMedia 
                  project={project}
                  projectImages={projectImages}
                  projectVideos={projectVideos}
                  projectPDFs={projectPDFs}
                  projectZIPs={projectZIPs}
                />
              </div>
              
              {/* Project Actions - Mobile/Tablet */}
              <div className="xl:hidden border-t border-gray-200 p-6">
                <ProjectActions
                  project={project}
                  isEditing={isEditing}
                  canEditOrDelete={canEditOrDelete}
                  canExpressInterest={canExpressInterest}
                  canWriteReview={canWriteReview}
                  onDownload={onDownload}
                  onEdit={onEdit}
                  onSave={onSave}
                  onDelete={onDelete}
                  onExpressInterest={onExpressInterest}
                  onWriteReview={onWriteReview}
                />
              </div>
            </div>

            {/* Description & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Description */}
              <div className="lg:col-span-2">
                <ProjectDescription 
                  project={project}
                  isEditing={isEditing}
                  editedDescription={editedDescription}
                  onDescriptionChange={onDescriptionChange}
                />
              </div>
            </div>

            {/* Team and Reviews */}
            <ProjectTeamAndReviews 
              project={project}
              teamMembers={teamMembers}
              projectReviews={projectReviews}
              canWriteReview={canWriteReview}
              onWriteReview={onWriteReview}
            />
          </div>

          {/* Right Column - Sidebar (Desktop Only) */}
          <div className="xl:col-span-1 space-y-6 hidden xl:block">
            
            {/* Project Actions */}
            <ProjectActions
              project={project}
              isEditing={isEditing}
              canEditOrDelete={canEditOrDelete}
              canExpressInterest={canExpressInterest}
              canWriteReview={canWriteReview}
              onDownload={onDownload}
              onEdit={onEdit}
              onSave={onSave}
              onDelete={onDelete}
              onExpressInterest={onExpressInterest}
              onWriteReview={onWriteReview}
            />

            {/* Project Sidebar */}
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
  );
};

export default ProjectDetailLayout;
